import { createFileRoute, useNavigate } from "@tanstack/react-router";
import useAuthStore from "../store/AuthStore";
import { useEffect, useRef, useState } from "react";
import { LeftNav } from "../components/LeftNav";
import { TopNav } from "../components/TopNav";
import { useQuery } from "@tanstack/react-query";
import { getPlanByIdQueryOptions } from "../lib/api/plans";
import { CreateIncome } from "../components/CreateIncome";
import { CreateExpenditure } from "../components/CreateExpenditure";
import { getIncomesByPlanIdQueryOptions } from "../lib/api/incomes";
import { IncomeItem } from "../components/IncomeItem";
import { CreateAsset } from "../components/CreateAsset";
import { CreateLiability } from "../components/CreateLiability";
import { CreateFinancialGoal } from "../components/CreateFinancialGoal";
import { getExpendituresByPlanIdQueryOptions } from "../lib/api/expenditures";
import { ExpenditureItem } from "../components/ExpenditureItem";
import { getAssetsByPlanIdQueryOptions } from "../lib/api/assets";
import { AssetItem } from "../components/AssetItem";
import { getLiabilitiesByPlanIdQueryOptions } from "../lib/api/liabilities";
import { LiabilityItem } from "../components/LiabilityItem";
import { getFinancialGoalsByPlanIdQueryOptions } from "../lib/api/financialGoals";
import { FinancialGoalItem } from "../components/FinancialGoalItem";
import {
  getGenerationsByPlanIdQueryOptions,
  useCreateGenerationMutation,
} from "../lib/api/generations";
import { GenerationItem } from "../components/GenerationItem";
import { PiCaretDownBold } from "react-icons/pi";
import { CurrencyComponent } from "../components/CurrencyComponent";
import { CountriesDropdown } from "../components/CountriesDropdown";
import { YearsDropdown } from "../components/YearsDropdown";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const {
    data: plan,
    isLoading: planLoading,
    error: planError,
  } = useQuery(getPlanByIdQueryOptions((user && user.currentPlan) || 0));
  const [createIncomeMode, setCreateIncomeMode] = useState(false);
  const [createExpenditureMode, setCreateExpenditureMode] = useState(false);
  const [createAssetMode, setCreateAssetMode] = useState(false);
  const [createLiabilityMode, setCreateLiabilityMode] = useState(false);
  const [createFinancialGoalMode, setCreateFinancialGoalMode] = useState(false);
  const {
    data: incomes,
    isLoading: incomesLoading,
    error: incomesError,
  } = useQuery({
    ...getIncomesByPlanIdQueryOptions(plan?.planId ?? 0),
    enabled: !!plan?.planId,
  });
  const {
    data: expenditures,
    isLoading: expendituresLoading,
    error: expendituresError,
  } = useQuery({
    ...getExpendituresByPlanIdQueryOptions(plan?.planId ?? 0),
    enabled: !!plan?.planId,
  });
  const {
    data: assets,
    isLoading: assetsLoading,
    error: assetsError,
  } = useQuery({
    ...getAssetsByPlanIdQueryOptions(plan?.planId ?? 0),
    enabled: !!plan?.planId,
  });
  const {
    data: liabilities,
    isLoading: liabilitiesLoading,
    error: liabilitiesError,
  } = useQuery({
    ...getLiabilitiesByPlanIdQueryOptions(plan?.planId ?? 0),
    enabled: !!plan?.planId,
  });
  const {
    data: financialGoals,
    isLoading: financialGoalsLoading,
    error: financialGoalsError,
  } = useQuery({
    ...getFinancialGoalsByPlanIdQueryOptions(plan?.planId ?? 0),
    enabled: !!plan?.planId,
  });
  const {
    data: generations,
    isLoading: generationsLoading,
    error: generationsError,
  } = useQuery({
    ...getGenerationsByPlanIdQueryOptions(plan?.planId ?? 0),
    enabled: !!plan?.planId,
  });
  const { mutate: createGeneration, isPending: createGenerationPending } =
    useCreateGenerationMutation();
  const totalIncome =
    incomes &&
    incomes.reduce(
      (sum, income) =>
        sum + ((income.amount / 100) * (100 - income.tax / 100)) / 100,
      0,
    );
  const totalExpenditure =
    expenditures &&
    expenditures.reduce(
      (sum, expenditure) => sum + expenditure.amount / 100,
      0,
    );
  const cashflow =
    incomes &&
    expenditures &&
    incomes.reduce(
      (sum, income) =>
        sum + ((income.amount / 100) * (100 - income.tax / 100)) / 100,
      0,
    ) -
      expenditures.reduce(
        (sum, expenditure) => sum + expenditure.amount / 100,
        0,
      );
  const netWorth =
    assets &&
    liabilities &&
    assets.reduce((sum, asset) => sum + asset.value / 100, 0) -
      liabilities.reduce((sum, liability) => sum + liability.amount / 100, 0);
  const [generationNotification, setGenerationNotification] = useState("");
  const [showLeftNav, setShowLeftNav] = useState(
    window.innerWidth > 639 ? true : false,
  );
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const currencyRef = useRef<HTMLDivElement | null>(null);
  const [editYearMode, setEditYearMode] = useState(false);
  const [editCountryMode, setEditCountryMode] = useState(false);
  const yearRef = useRef<HTMLDivElement | null>(null);
  const countryRef = useRef<HTMLDivElement | null>(null);

  function handleCreateGeneration() {
    if (createGenerationPending) return;
    createGeneration(
      { planId: plan!.planId },
      {
        onError: (errorMessage) =>
          setGenerationNotification(errorMessage.toString()),
      },
    );
  }

  function handleClickOutsideCurrency(event: MouseEvent) {
    if (
      currencyRef.current &&
      !currencyRef.current.contains(event.target as Node)
    ) {
      setShowCurrencyDropdown(false);
    }
  }

  function handleClickOutsideYear(event: MouseEvent) {
    if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
      setEditYearMode(false);
    }
  }

  function handleClickOutsideCountry(event: MouseEvent) {
    if (
      countryRef.current &&
      !countryRef.current.contains(event.target as Node)
    ) {
      setEditCountryMode(false);
    }
  }

  useEffect(() => {
    if (!user) navigate({ to: "/" });
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [plan]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideCurrency);
    return () =>
      document.removeEventListener("click", handleClickOutsideCurrency);
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideYear);
    return () => document.removeEventListener("click", handleClickOutsideYear);
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideCountry);
    return () =>
      document.removeEventListener("click", handleClickOutsideCountry);
  }, []);

  return (
    <div className="bg-[#242424] text-white min-h-screen p-2">
      {showLeftNav && <LeftNav />}
      <TopNav showLeftNav={showLeftNav} setShowLeftNav={setShowLeftNav} />
      {planLoading ? (
        <div className="md:pl-[300px] pt-4 text-lg">Loading...</div>
      ) : planError ? (
        <div className="md:pl-[300px] pt-4 text-lg">
          There was an error loading your plan. Please try again later.
        </div>
      ) : plan ? (
        <div className="md:pl-[240px]">
          <div className="pl-5 pt-10 text-4xl font-bold">{plan.title}</div>
          <div className="relative pl-5 pt-5 flex items-center">
            <div className="mr-2">Currency:</div>
            <div
              ref={currencyRef}
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              className="flex border border-[#a0a0a0] px-1 items-center justify-center cursor-pointer hover:bg-[#303030] transition-all ease-in-out duration-300"
            >
              <div className="mr-2 font-bold">{plan.currency}</div>
              <PiCaretDownBold />
            </div>
            {showCurrencyDropdown && <CurrencyComponent plan={plan} />}
          </div>
          <div className="border-b border-b-[#777777] pb-5">
            {incomesLoading ? (
              <div>Loading income items...</div>
            ) : incomesError ? (
              <div>Error loading income items</div>
            ) : incomes ? (
              <div className="pl-5">
                <div className="pt-5 text-3xl font-bold">Income</div>
                <div className="flex justify-between my-2">
                  <div className="w-[25%]">Company</div>
                  <div className="w-[25%]">Position</div>
                  <div className="w-[25%]">Amount (Monthly)</div>
                  <div className="w-[25%]">Tax %</div>
                  <div className="w-[70px]"></div>
                </div>
                {incomes.map((income) => (
                  <IncomeItem key={income.incomeId} income={income} />
                ))}
                {createIncomeMode ? (
                  <CreateIncome
                    setCreateIncomeMode={setCreateIncomeMode}
                    plan={plan}
                  />
                ) : (
                  <div
                    onClick={() => setCreateIncomeMode(true)}
                    className="mt-5 py-1 w-[130px] text-center cursor-pointer hover:text-cyan-500 transition-all ease-in-out duration-300 border border-[#777777] hover:border-cyan-500 rounded"
                  >
                    + Add income
                  </div>
                )}
                <div className="pt-5">
                  Total income: {plan.currency}
                  {(totalIncome &&
                    totalIncome.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })) ||
                    "0"}
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="border-b border-b-[#777777] pb-5">
            {expendituresLoading ? (
              <div>Loading expenditures...</div>
            ) : expendituresError ? (
              <div>Error loading expenditures</div>
            ) : expenditures ? (
              <div className="pl-5">
                <div className="pt-5 text-3xl font-bold">Expenditure</div>
                <div className="flex justify-between my-2">
                  <div className="w-[50%]">Name</div>
                  <div className="w-[50%]">Amount (Monthly)</div>
                  <div className="w-17.5"></div>
                </div>
                {expenditures.map((e) => (
                  <ExpenditureItem key={e.expenditureId} expenditure={e} />
                ))}
                {createExpenditureMode ? (
                  <CreateExpenditure
                    plan={plan}
                    setCreateExpenditureMode={setCreateExpenditureMode}
                  />
                ) : (
                  <div
                    onClick={() => setCreateExpenditureMode(true)}
                    className="mt-5 py-1 w-40 text-center cursor-pointer hover:text-cyan-500 transition-all ease-in-out duration-300 border border-[#777777] hover:border-cyan-500 rounded"
                  >
                    + Add expenditure
                  </div>
                )}
                <div className="pt-5">
                  Total expenditure: {plan.currency}
                  {(totalExpenditure &&
                    totalExpenditure.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })) ||
                    "0"}
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="border-b border-b-[#777777] bg-[#303030] pb-5">
            <div className="pl-5">
              <div className="pt-5 font-bold">
                Total cashflow: {plan.currency}
                {(cashflow &&
                  cashflow.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })) ||
                  "0"}
              </div>
            </div>
          </div>
          <div className="border-b border-b-[#777777] pb-5">
            {assetsLoading ? (
              <div>Loading...</div>
            ) : assetsError ? (
              <div>Error loading assets</div>
            ) : assets ? (
              <div className="pl-5">
                <div className="pt-5 text-3xl font-bold">Assets</div>
                <div className="flex justify-between my-2">
                  <div className="w-[33%]">Name</div>
                  <div className="w-[33%]">Value</div>
                  <div className="w-[33%]">Return on invesment %</div>
                  <div className="w-17.5"></div>
                </div>
                {assets.map((a) => (
                  <AssetItem key={a.assetId} asset={a} />
                ))}
                {createAssetMode ? (
                  <CreateAsset
                    plan={plan}
                    setCreateAssetMode={setCreateAssetMode}
                  />
                ) : (
                  <div
                    onClick={() => setCreateAssetMode(true)}
                    className="mt-5 py-1 w-32.5 text-center cursor-pointer hover:text-cyan-500 transition-all ease-in-out duration-300 border border-[#777777] hover:border-cyan-500 rounded"
                  >
                    + Add asset
                  </div>
                )}
                <div className="pt-5">
                  Total assets: {plan.currency}
                  {assets
                    .reduce((sum, asset) => sum + asset.value / 100, 0)
                    .toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="border-b border-b-[#777777] pb-5">
            {liabilitiesLoading ? (
              <div>Loading liabilities...</div>
            ) : liabilitiesError ? (
              <div>Error loading liabilities</div>
            ) : liabilities ? (
              <div className="pl-5">
                <div className="pt-5 text-3xl font-bold">Liabilities</div>
                <div className="flex justify-between my-2">
                  <div className="w-[33%]">Name</div>
                  <div className="w-[33%]">Amount</div>
                  <div className="w-[33%]">Monthly Interest %</div>
                  <div className="w-17.5"></div>
                </div>
                {liabilities.map((l) => (
                  <LiabilityItem key={l.liabilityId} liability={l} />
                ))}
                {createLiabilityMode ? (
                  <CreateLiability
                    plan={plan}
                    setCreateLiabilityMode={setCreateLiabilityMode}
                  />
                ) : (
                  <div
                    onClick={() => setCreateLiabilityMode(true)}
                    className="mt-5 py-1 w-40 text-center cursor-pointer hover:text-cyan-500 transition-all ease-in-out duration-300 border border-[#777777] hover:border-cyan-500 rounded"
                  >
                    + Add liability
                  </div>
                )}
                <div className="pt-5">
                  Total liabilities: {plan.currency}
                  {liabilities
                    .reduce((sum, liability) => sum + liability.amount / 100, 0)
                    .toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="border-b border-b-[#777777] pb-5 bg-[#303030]">
            <div className="pl-5">
              <div className="pt-5 font-bold">
                Total net worth: {plan.currency}
                {(netWorth &&
                  netWorth.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })) ||
                  "0"}
              </div>
            </div>
          </div>
          <div className="border-b border-b-[#777777] pb-5">
            {financialGoalsLoading ? (
              <div>Loading financial goals...</div>
            ) : financialGoalsError ? (
              <div>Error loading financial goals</div>
            ) : financialGoals ? (
              <div className="pl-5">
                <div className="pt-5 text-3xl font-bold">Financial Goals</div>
                <div className="flex justify-between my-2">
                  <div className="w-[33%]">Name</div>
                  <div className="w-[33%]">Amount</div>
                  <div className="w-[33%]">Target Date</div>
                  <div className="w-17.5"></div>
                </div>
                {financialGoals.map((f) => (
                  <FinancialGoalItem
                    key={f.financialGoalId}
                    financialGoal={f}
                  />
                ))}
                {createFinancialGoalMode ? (
                  <CreateFinancialGoal
                    plan={plan}
                    setCreateFinancialGoalMode={setCreateFinancialGoalMode}
                  />
                ) : (
                  <div
                    onClick={() => setCreateFinancialGoalMode(true)}
                    className="mt-5 py-1 w-40 text-center cursor-pointer hover:text-cyan-500 transition-all ease-in-out duration-300 border border-[#777777] hover:border-cyan-500 rounded"
                  >
                    + Add financial goal
                  </div>
                )}
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="border-b border-b-[#777777] pb-5">
            <div className="pl-5">
              <div className="pt-5 text-3xl font-bold">
                Additional Information
              </div>
              <div className="my-2">
                <div className="relative flex my-2">
                  <div className="w-[32%]">Year of Birth</div>
                  <div
                    ref={yearRef}
                    onClick={() => setEditYearMode(!editYearMode)}
                    className="flex border border-[#a0a0a0] px-1 items-center justify-center cursor-pointer hover:bg-[#303030] transition-all ease-in-out duration-300"
                  >
                    <div className="mr-2">{plan.yearOfBirth}</div>
                    <PiCaretDownBold />
                  </div>
                  {editYearMode && <YearsDropdown plan={plan} />}
                </div>
                <div className="relative flex my-2">
                  <div className="w-[32%]">Country of Residence</div>
                  <div
                    ref={countryRef}
                    onClick={() => setEditCountryMode(!editCountryMode)}
                    className="flex border border-[#a0a0a0] px-1 items-center justify-center cursor-pointer hover:bg-[#303030] transition-all ease-in-out duration-300"
                  >
                    <div className="mr-2">{plan.location}</div>
                    <PiCaretDownBold />
                  </div>
                  {editCountryMode && <CountriesDropdown plan={plan} />}
                </div>
              </div>
            </div>
          </div>
          <div className="border-b border-b-[#777777] pb-5 bg-[#303030]">
            <div className="pl-5">
              <div className="pt-5 text-3xl font-bold">Recommendations</div>
              <div className="mt-2 text-xs">
                Disclaimer: The information provided here is for general
                informational purposes only and does not constitute financial
                advice. You should consult a qualified financial professional
                before making financial decisions.
              </div>
              <div className="py-5">
                <ol>
                  {incomes &&
                  expenditures &&
                  totalExpenditure &&
                  totalIncome &&
                  cashflow &&
                  (incomes.length > 0 || expenditures.length > 0) ? (
                    totalExpenditure > totalIncome ? (
                      <li>
                        <b>1. Improve your cashflow</b> - you are spending more
                        than you are making. Try to reduce your spending or if a
                        raise or promotion is not on the horizon, consider
                        creating additional sources of income.
                      </li>
                    ) : cashflow < totalIncome * 0.1 ? (
                      <li>
                        <b>1. Your cashflow is semi-healthy</b> - you are
                        spending within your means but you are saving less than
                        10% of your income. Try to reduce your spending or if a
                        raise or promotion is not on the horizon, consider
                        creating additional sources of income for additional
                        savings.
                      </li>
                    ) : (
                      <li>
                        <b>1. Your cashflow is healthy</b> - you are able to
                        save more than 10% or more of your income. If you are
                        not already, consider investing your savings.
                      </li>
                    )
                  ) : (
                    <li></li>
                  )}
                  {incomes &&
                  expenditures &&
                  netWorth &&
                  totalIncome &&
                  (incomes.length > 0 || expenditures.length > 0) ? (
                    netWorth < 0 ? (
                      <li className="my-2">
                        <b>2. Payoff your debts</b> - your priority is to payoff
                        your debts with high interest. Once your debts are paid
                        off, we can start working on long-term savings plan.
                      </li>
                    ) : netWorth < totalIncome * 3 ? (
                      <li className="my-2">
                        <b>2. Build an emergency fund</b> - save up until you
                        have at least 3 months' worth of salary in your savings
                        account. Once you have an emergency fund set up, we can
                        start working on long-term savings plan for your
                        financial goals.
                      </li>
                    ) : (
                      <li className="my-2">
                        <b>2. Your net worth is healthy</b> - you have
                        sufficient assets to ensure your immediate needs are met
                        and work on any financial goals you may have.
                      </li>
                    )
                  ) : (
                    <li></li>
                  )}
                </ol>
              </div>
              {generationsLoading ? (
                <div>Loading AI recommendations...</div>
              ) : generationsError ? (
                <div>Error loading AI recommendations</div>
              ) : generations ? (
                generations.map((g) => (
                  <GenerationItem key={g.generationId} g={g} />
                ))
              ) : (
                <div></div>
              )}
              {incomes && incomes.length > 0 && (
                <div
                  onClick={handleCreateGeneration}
                  className={`py-2 rounded ${createGenerationPending ? "bg-[#222222]" : "bg-linear-to-r from-blue-500 via-teal-500 to-green-500"} w-[300px] text-center cursor-pointer hover:from-blue-400 hover:via-teal-400 hover:to-green-400 transition-all ease-in-out duration-300`}
                >
                  {createGenerationPending
                    ? "Generating..."
                    : "Generate AI Recommendations"}
                </div>
              )}
              <div>{generationNotification}</div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {window.innerWidth < 768 && showLeftNav && (
        <div className="fixed inset-0 bg-black opacity-50 z-100"></div>
      )}
    </div>
  );
}
