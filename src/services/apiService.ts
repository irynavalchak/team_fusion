import axios from 'axios';

export const createTransaction = async (transaction: Transaction) => {
  try {
    const transactionModel: TransactionModel = {
      organization_id: transaction.organizationId,
      category_id: transaction.categoryId,
      account_id: transaction.accountId,
      transaction_type: transaction.transactionType,
      amount: transaction.amount,
      currency: transaction.currency,
      exchange_rate: transaction.exchangeRate,
      description: transaction.description,
      transaction_date: transaction.transactionDate
    };

    const response = await axios.post('/api/transaction/create', transactionModel);

    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error);
  }
};

export const createTransfer = async (transfer: Transfer) => {
  try {
    const transferModel: TransferModel = {
      transaction_id: transfer.transactionId,
      from_account_id: transfer.fromAccountId,
      to_account_id: transfer.toAccountId,
      from_amount: transfer.fromAmount,
      to_amount: transfer.toAmount,
      exchange_rate: transfer.exchangeRate
    };

    const response = await axios.post('/api/transfer/create', transferModel);

    return response;
  } catch (error) {
    console.error('Error creating transfer:', error);
  }
};

export const getAccounts = async () => {
  try {
    const response = await axios.get('/api/account');

    const accounts: Account[] = response?.data?.finance_accounts?.map((account: AccountModel) => ({
      id: account.id,
      organizationId: account.organization_id,
      name: account.name,
      accountType: account.account_type,
      currency: account.currency,
      initialBalance: account.initial_balance,
      currentBalance: account.current_balance,
      isActive: account.is_active,
      createdAt: account.created_at,
      updatedAt: account.updated_at,
      closedAt: account.closed_at
    }));

    return accounts;
  } catch (error) {
    console.error('Error getting accounts:', error);
    return [];
  }
};

export const getOrganizations = async () => {
  try {
    const response = await axios.get('/api/organization');

    const organizations: Organization[] = response?.data?.finance_organizations?.map(
      (organization: OrganizationModel) => ({
        id: organization.id,
        name: organization.name,
        country: organization.country,
        currency: organization.currency,
        taxId: organization.tax_id,
        createdAt: organization.created_at,
        updatedAt: organization.updated_at
      })
    );

    return organizations;
  } catch (error) {
    console.error('Error getting organizations:', error);
    return [];
  }
};

export const getTransactionCategories = async () => {
  try {
    const response = await axios.get('/api/transaction_category');

    const organizations: TransactionCategory[] = response?.data?.finance_transaction_categories?.map(
      (category: TransactionCategoryModel) => ({
        id: category.id,
        name: category.name,
        type: category.type,
        createdAt: category.created_at
      })
    );

    return organizations;
  } catch (error) {
    console.error('Error getting organizations:', error);
    return [];
  }
};

export const getMonthlyTransactions = async (organizationId: string, startDate: string, endDate: string) => {
  try {
    const response = await axios.get('/api/transaction', {
      params: {
        organization_id: organizationId,
        start_date: startDate,
        end_date: endDate
      }
    });

    const transactions: Transaction[] = response?.data?.finance_transactions?.map((transaction: TransactionModel) => ({
      id: transaction.id,
      organizationId: transaction.organization_id,
      categoryId: transaction.category_id,
      accountId: transaction.account_id,
      transactionType: transaction.transaction_type,
      amount: transaction.amount,
      currency: transaction.currency,
      exchangeRate: transaction.exchange_rate,
      description: transaction.description,
      transactionDate: transaction.transaction_date
    }));

    return transactions;
  } catch (error) {
    console.error('Error getting monthly transactions:', error);
    return [];
  }
};

export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await axios.get('/api/projects');
    const data = response.data.projects.projects;

    const projects: Project[] = data.map((project: ProjectModel) => ({
      id: project.id,
      name: project.name,
      missions: project.missions.map((mission: MissionModel) => ({
        id: mission.id,
        name: mission.name,
        status: mission.status,
        createdAt: mission.created_at,
        tasks: mission.tasks.map((task: TaskModel) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          createdAt: task.created_at
        }))
      }))
    }));

    return projects;
  } catch (error) {
    console.error('Error getting projects:', error);
    return [];
  }
};

export const getUserData = async (): Promise<UserData | null> => {
  try {
    const response = await axios.get('/api/userData');

    const data: UserDataModel = response.data.users;

    const userData: UserData = {
      users: data.users.map((user: UserModel) => ({
        id: user.id,
        name: user.name,
        email: user.email
      })),
      missionUsers: data.mission_users.map((missionUser: MissionUserModel) => ({
        missionId: missionUser.mission_id,
        userId: missionUser.user_id
      })),
      taskUsers: data.task_users.map((taskUser: TaskUserModel) => ({
        taskId: taskUser.task_id,
        userId: taskUser.user_id
      }))
    };

    return userData;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const getMissionById = async (projectId: string, missionId: string): Promise<Mission | null> => {
  try {
    const response = await axios.get('/api/projects');
    const projects: ProjectModel[] = response.data.projects.projects;

    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return null;
    }

    const missionData = project.missions.find(m => m.id === missionId);
    if (!missionData) {
      return null;
    }

    const mission: Mission = {
      id: missionData.id,
      name: missionData.name,
      status: missionData.status,
      createdAt: missionData.created_at,
      tasks: missionData.tasks.map((task: TaskModel) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.created_at
      }))
    };

    return mission;
  } catch (error) {
    console.error('Error getting mission:', error);
    return null;
  }
};

export const getDocuments = async (): Promise<UserDocument[]> => {
  try {
    const response = await axios.get('/api/documents');
    const data = response.data.documents;

    const documents: UserDocument[] = data.map((doc: UserDocumentModel) => ({
      id: doc.id,
      title: doc.title,
      tagPath: doc.tag_path,
      createdAt: doc.created_at,
      updatedAt: doc.updated_at,
      createdBy: doc.created_by,
      lastModifiedBy: doc.last_modified_by,
      contents: doc.contents.map((content: UserDocumentContentModel) => ({
        languageCode: content.language_code,
        content: content.content,
        createdAt: content.created_at,
        updatedAt: content.updated_at
      }))
    }));

    return documents;
  } catch (error) {
    console.error('Error getting documents:', error);
    return [];
  }
};
