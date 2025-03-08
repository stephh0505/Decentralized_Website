// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title GhostFund
 * @dev Main contract for the GhostFund platform
 * Handles project creation and funding with privacy features
 */
contract GhostFund {
    // State variables
    address public owner;
    address public mixersContract;
    uint256 public projectCount;
    uint256 public platformFee; // Fee in basis points (1/100 of a percent)
    
    // Project structure
    struct Project {
        uint256 id;
        string title;
        string description;
        uint256 fundingGoal;
        uint256 currentFunding;
        address payable ownerAddress;
        bool isAnonymous;
        uint256 deadline;
        bool isFunded;
        bool isCancelled;
    }
    
    // Funding event structure
    struct Funding {
        uint256 projectId;
        address funder;
        uint256 amount;
        uint256 timestamp;
        bool isAnonymous;
    }
    
    // Mappings
    mapping(uint256 => Project) public projects;
    mapping(uint256 => Funding[]) public projectFundings;
    mapping(address => uint256[]) public userProjects;
    mapping(address => uint256[]) public userFundings;
    
    // Events
    event ProjectCreated(
        uint256 indexed projectId,
        string title,
        address indexed creator,
        uint256 fundingGoal,
        bool isAnonymous
    );
    
    event ProjectFunded(
        uint256 indexed projectId,
        address indexed funder,
        uint256 amount,
        bool isAnonymous
    );
    
    event ProjectCompleted(
        uint256 indexed projectId,
        uint256 totalFunding
    );
    
    event ProjectCancelled(
        uint256 indexed projectId
    );
    
    event FundsWithdrawn(
        uint256 indexed projectId,
        address indexed recipient,
        uint256 amount
    );
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }
    
    modifier onlyProjectOwner(uint256 _projectId) {
        require(projects[_projectId].ownerAddress == msg.sender, "Only the project owner can call this function");
        _;
    }
    
    modifier projectExists(uint256 _projectId) {
        require(_projectId > 0 && _projectId <= projectCount, "Project does not exist");
        _;
    }
    
    modifier projectActive(uint256 _projectId) {
        require(!projects[_projectId].isFunded, "Project already funded");
        require(!projects[_projectId].isCancelled, "Project is cancelled");
        require(block.timestamp < projects[_projectId].deadline, "Project deadline has passed");
        _;
    }
    
    /**
     * @dev Constructor sets the contract owner and initial platform fee
     */
    constructor() {
        owner = msg.sender;
        platformFee = 250; // 2.5% fee (250 basis points)
        projectCount = 0;
    }
    
    /**
     * @dev Set the address of the mixers contract
     * @param _mixersContract Address of the mixers contract
     */
    function setMixersContract(address _mixersContract) external onlyOwner {
        mixersContract = _mixersContract;
    }
    
    /**
     * @dev Set the platform fee
     * @param _fee New fee in basis points
     */
    function setPlatformFee(uint256 _fee) external onlyOwner {
        require(_fee <= 1000, "Fee cannot exceed 10%");
        platformFee = _fee;
    }
    
    /**
     * @dev Create a new project
     * @param _title Project title
     * @param _description Project description
     * @param _fundingGoal Funding goal in wei
     * @param _durationDays Project duration in days
     * @param _isAnonymous Whether the project creator wants to remain anonymous
     * @return projectId The ID of the created project
     */
    function createProject(
        string memory _title,
        string memory _description,
        uint256 _fundingGoal,
        uint256 _durationDays,
        bool _isAnonymous
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_fundingGoal > 0, "Funding goal must be greater than 0");
        require(_durationDays > 0 && _durationDays <= 365, "Duration must be between 1 and 365 days");
        
        projectCount++;
        uint256 projectId = projectCount;
        
        // Create new project
        projects[projectId] = Project({
            id: projectId,
            title: _title,
            description: _description,
            fundingGoal: _fundingGoal,
            currentFunding: 0,
            ownerAddress: payable(msg.sender),
            isAnonymous: _isAnonymous,
            deadline: block.timestamp + (_durationDays * 1 days),
            isFunded: false,
            isCancelled: false
        });
        
        // Add project to user's projects
        userProjects[msg.sender].push(projectId);
        
        // Emit event
        emit ProjectCreated(
            projectId,
            _title,
            _isAnonymous ? address(0) : msg.sender,
            _fundingGoal,
            _isAnonymous
        );
        
        return projectId;
    }
    
    /**
     * @dev Fund a project
     * @param _projectId ID of the project to fund
     * @param _isAnonymous Whether the funder wants to remain anonymous
     */
    function fundProject(uint256 _projectId, bool _isAnonymous) 
        external 
        payable 
        projectExists(_projectId) 
        projectActive(_projectId) 
    {
        require(msg.value > 0, "Funding amount must be greater than 0");
        
        Project storage project = projects[_projectId];
        
        // Calculate platform fee
        uint256 fee = (msg.value * platformFee) / 10000;
        uint256 fundingAmount = msg.value - fee;
        
        // Update project funding
        project.currentFunding += fundingAmount;
        
        // Record funding
        Funding memory newFunding = Funding({
            projectId: _projectId,
            funder: _isAnonymous ? address(0) : msg.sender,
            amount: fundingAmount,
            timestamp: block.timestamp,
            isAnonymous: _isAnonymous
        });
        
        projectFundings[_projectId].push(newFunding);
        
        // Add funding to user's fundings if not anonymous
        if (!_isAnonymous) {
            userFundings[msg.sender].push(_projectId);
        }
        
        // Check if project is now fully funded
        if (project.currentFunding >= project.fundingGoal) {
            project.isFunded = true;
            emit ProjectCompleted(_projectId, project.currentFunding);
        }
        
        // Emit funding event
        emit ProjectFunded(
            _projectId,
            _isAnonymous ? address(0) : msg.sender,
            fundingAmount,
            _isAnonymous
        );
        
        // Transfer platform fee to contract owner
        payable(owner).transfer(fee);
    }
    
    /**
     * @dev Fund a project anonymously through the mixers contract
     * @param _projectId ID of the project to fund
     */
    function fundProjectAnonymously(uint256 _projectId) 
        external 
        payable 
        projectExists(_projectId) 
        projectActive(_projectId) 
    {
        require(mixersContract != address(0), "Mixers contract not set");
        require(msg.sender == mixersContract, "Only mixers contract can call this function");
        require(msg.value > 0, "Funding amount must be greater than 0");
        
        Project storage project = projects[_projectId];
        
        // Calculate platform fee
        uint256 fee = (msg.value * platformFee) / 10000;
        uint256 fundingAmount = msg.value - fee;
        
        // Update project funding
        project.currentFunding += fundingAmount;
        
        // Record anonymous funding
        Funding memory newFunding = Funding({
            projectId: _projectId,
            funder: address(0),
            amount: fundingAmount,
            timestamp: block.timestamp,
            isAnonymous: true
        });
        
        projectFundings[_projectId].push(newFunding);
        
        // Check if project is now fully funded
        if (project.currentFunding >= project.fundingGoal) {
            project.isFunded = true;
            emit ProjectCompleted(_projectId, project.currentFunding);
        }
        
        // Emit funding event
        emit ProjectFunded(
            _projectId,
            address(0),
            fundingAmount,
            true
        );
        
        // Transfer platform fee to contract owner
        payable(owner).transfer(fee);
    }
    
    /**
     * @dev Withdraw funds from a funded project
     * @param _projectId ID of the project
     */
    function withdrawFunds(uint256 _projectId) 
        external 
        projectExists(_projectId) 
        onlyProjectOwner(_projectId) 
    {
        Project storage project = projects[_projectId];
        
        require(project.isFunded, "Project is not funded yet");
        require(project.currentFunding > 0, "No funds to withdraw");
        
        uint256 amount = project.currentFunding;
        project.currentFunding = 0;
        
        // Transfer funds to project owner
        project.ownerAddress.transfer(amount);
        
        // Emit event
        emit FundsWithdrawn(_projectId, project.ownerAddress, amount);
    }
    
    /**
     * @dev Cancel a project
     * @param _projectId ID of the project to cancel
     */
    function cancelProject(uint256 _projectId) 
        external 
        projectExists(_projectId) 
        onlyProjectOwner(_projectId) 
    {
        Project storage project = projects[_projectId];
        
        require(!project.isFunded, "Cannot cancel a funded project");
        require(!project.isCancelled, "Project is already cancelled");
        
        project.isCancelled = true;
        
        // Emit event
        emit ProjectCancelled(_projectId);
        
        // Refund all funders
        Funding[] storage fundings = projectFundings[_projectId];
        for (uint256 i = 0; i < fundings.length; i++) {
            if (fundings[i].funder != address(0)) {
                payable(fundings[i].funder).transfer(fundings[i].amount);
            }
            // Anonymous funders cannot be refunded directly
            // They need to claim their refund through the mixers contract
        }
    }
    
    /**
     * @dev Get project details
     * @param _projectId ID of the project
     * @return Project details
     */
    function getProject(uint256 _projectId) 
        external 
        view 
        projectExists(_projectId) 
        returns (
            uint256 id,
            string memory title,
            string memory description,
            uint256 fundingGoal,
            uint256 currentFunding,
            address ownerAddress,
            bool isAnonymous,
            uint256 deadline,
            bool isFunded,
            bool isCancelled
        ) 
    {
        Project memory project = projects[_projectId];
        
        return (
            project.id,
            project.title,
            project.description,
            project.fundingGoal,
            project.currentFunding,
            project.isAnonymous ? address(0) : project.ownerAddress,
            project.isAnonymous,
            project.deadline,
            project.isFunded,
            project.isCancelled
        );
    }
    
    /**
     * @dev Get the number of fundings for a project
     * @param _projectId ID of the project
     * @return Number of fundings
     */
    function getFundingsCount(uint256 _projectId) 
        external 
        view 
        projectExists(_projectId) 
        returns (uint256) 
    {
        return projectFundings[_projectId].length;
    }
    
    /**
     * @dev Get funding details
     * @param _projectId ID of the project
     * @param _index Index of the funding
     * @return Funding details
     */
    function getFunding(uint256 _projectId, uint256 _index) 
        external 
        view 
        projectExists(_projectId) 
        returns (
            address funder,
            uint256 amount,
            uint256 timestamp,
            bool isAnonymous
        ) 
    {
        require(_index < projectFundings[_projectId].length, "Funding index out of bounds");
        
        Funding memory funding = projectFundings[_projectId][_index];
        
        return (
            funding.funder,
            funding.amount,
            funding.timestamp,
            funding.isAnonymous
        );
    }
    
    /**
     * @dev Get projects created by a user
     * @param _user Address of the user
     * @return Array of project IDs
     */
    function getUserProjects(address _user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userProjects[_user];
    }
    
    /**
     * @dev Get projects funded by a user (non-anonymous only)
     * @param _user Address of the user
     * @return Array of project IDs
     */
    function getUserFundings(address _user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userFundings[_user];
    }
    
    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {
        // Just accept ETH, no specific action
    }
} 