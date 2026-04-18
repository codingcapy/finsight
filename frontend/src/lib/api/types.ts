// TypeScript types matching Go backend models

export interface User {
  userId: string;
  username: string;
  email: string;
  password: string;
  profilePic: string | null;
  role: string;
  status: string;
  preference: string;
  createdAt: string;
  currentPlan: number;
}

export interface Plan {
  planId: number;
  userId: string;
  title: string;
  icon: string | null;
  currency: string;
  location: string;
  yearOfBirth: string;
  status: string;
  createdAt: string;
}

export interface Asset {
  assetId: number;
  planId: number;
  name: string;
  value: number;
  roi: number;
  status: string;
  createdAt: string;
}

export interface Expenditure {
  expenditureId: number;
  planId: number;
  name: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface Income {
  incomeId: number;
  planId: number;
  company: string;
  position: string;
  amount: number;
  tax: number;
  status: string;
  createdAt: string;
}

export interface Liability {
  liabilityId: number;
  planId: number;
  name: string;
  amount: number;
  interest: number;
  status: string;
  createdAt: string;
}

export interface FinancialGoal {
  financialGoalId: number;
  planId: number;
  name: string;
  amount: number;
  targetDate: string;
  createdAt: string;
}

export interface Generation {
  generationId: number;
  planId: number;
  content: string;
  createdAt: string;
}

// Deserialized types (with Date objects instead of strings)

export interface DeserializedUser extends Omit<User, "createdAt"> {
  createdAt: Date;
}

export interface DeserializedPlan extends Omit<Plan, "createdAt"> {
  createdAt: Date;
}

export interface DeserializedAsset extends Omit<Asset, "createdAt"> {
  createdAt: Date;
}

export interface DeserializedExpenditure extends Omit<
  Expenditure,
  "createdAt"
> {
  createdAt: Date;
}

export interface DeserializedIncome extends Omit<Income, "createdAt"> {
  createdAt: Date;
}

export interface DeserializedLiability extends Omit<Liability, "createdAt"> {
  createdAt: Date;
}

export interface DeserializedFinancialGoal extends Omit<
  FinancialGoal,
  "createdAt" | "targetDate"
> {
  targetDate: Date;
  createdAt: Date;
}

export interface DeserializedGeneration extends Omit<Generation, "createdAt"> {
  createdAt: Date;
}

// Request types

export interface CreateAssetArgs {
  planId: number;
  name: string;
  value: number;
  roi: number;
}

export interface DeleteAssetArgs {
  assetId: number;
}

export interface UpdateAssetArgs {
  assetId: number;
  name: string;
  value: number;
  roi: number;
}

export interface CreateExpenditureArgs {
  planId: number;
  name: string;
  amount: number;
}

export interface DeleteExpenditureArgs {
  expenditureId: number;
}

export interface UpdateExpenditureArgs {
  expenditureId: number;
  name: string;
  amount: number;
}

export interface CreateIncomeArgs {
  planId: number;
  company: string;
  position: string;
  amount: number;
  tax: number;
}

export interface DeleteIncomeArgs {
  incomeId: number;
}

export interface UpdateIncomeArgs {
  incomeId: number;
  company: string;
  position: string;
  amount: number;
  tax: number;
}

export interface CreateLiabilityArgs {
  planId: number;
  name: string;
  amount: number;
  interest: number;
}

export interface DeleteLiabilityArgs {
  liabilityId: number;
}

export interface UpdateLiabilityArgs {
  liabilityId: number;
  name: string;
  amount: number;
  interest: number;
}

export interface CreateFinancialGoalArgs {
  planId: number;
  name: string;
  amount: number;
  targetDate: Date;
}

export interface DeleteFinancialGoalArgs {
  financialGoalId: number;
}

export interface UpdateFinancialGoalArgs {
  financialGoalId: number;
  name: string;
  amount: number;
  targetDate: Date;
}

export interface CreateGenerationArgs {
  planId: number;
}

export interface DeleteGenerationArgs {
  generationId: number;
}

export interface CreatePlanArgs {
  title: string;
}

export interface DeletePlanArgs {
  planId: number;
}

export interface UpdatePlanArgs {
  planId: number;
  title: string;
}

export interface UpdateCurrencyArgs {
  planId: number;
  currency: string;
}

export interface UpdateYearOfBirthArgs {
  planId: number;
  yearOfBirth: string;
}

export interface UpdateLocationArgs {
  planId: number;
  location: string;
}

export interface CreateUserArgs {
  username: string;
  email: string;
  password: string;
}

export interface UpdateCurrentPlanArgs {
  currentPlan: number;
}

export interface UpdatePasswordArgs {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordArgs {
  email: string;
}
