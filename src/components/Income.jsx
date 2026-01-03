// import { useState, useEffect } from "react";
// import {
//   Plus,
//   TrendingUp,
//   Calendar,
//   DollarSign,
//   Briefcase,
// } from "lucide-react";
// import { jwtDecode } from "jwt-decode";

// export default function Income() {
//   const [incomes, setIncomes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     amount: "",
//     category: "",
//     description: "",
//     date: new Date().toISOString().split("T")[0],
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [userId, setUserId] = useState("");

//   // Fetch authenticated user from token
//   useEffect(() => {
//     const token = localStorage.getItem("authToken"); // get token from localStorage
//     if (token) {
//       try {
//         const decoded = jwtDecode(token); // decode the JWT
//         const userData = decoded.user || decoded; // depending on your token structure
//         if (userData && userData._id) setUserId(userData._id);
//       } catch (err) {
//         console.error("Invalid token", err);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const fetchIncomes = async () => {
//       if (!userId) {
//         setLoading(false);
//         return;
//       }
//       setLoading(true);

//       try {
//         const res = await fetch(`http://localhost:8000/income?user_id=${userId}`);
//         if (!res.ok) throw new Error("Failed to fetch incomes");

//         const data = await res.json();

//         // Support both: backend returns an array OR { incomes: [...] }
//         if (Array.isArray(data)) {
//           setIncomes(data);
//         } else if (Array.isArray(data.incomes)) {
//           setIncomes(data.incomes);
//         } else if (Array.isArray(data.income)) {
//           setIncomes(data.income);
//         } else {
//           // fallback: maybe wrapped differently
//           setIncomes(data || []);
//         }
//       } catch (err) {
//         console.error(err);
//         setIncomes([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchIncomes();
//   }, [userId]);

//   // Add new income
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       if (!userId) {
//         alert("User not authenticated");
//         return;
//       }

//       const res = await fetch("http://localhost:8000/income", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           user_id: userId,
//           amount: parseFloat(formData.amount),
//           category: formData.category,
//           description: formData.description,
//           date: formData.date,
//         }),
//       });

//       // parse response regardless of OK or not so we can show backend message
//       const result = await res.json();

//       if (!res.ok) {
//         // backend error message
//         const msg = result?.message || "Failed to add income";
//         throw new Error(msg);
//       }

//       // Add new income to local list (if present)
//       if (result.income) {
//         setIncomes((prev) => [result.income, ...prev]);
//       } else if (result?.incomeAdded) {
//         // fallback naming
//         setIncomes((prev) => [result.incomeAdded, ...prev]);
//       } else if (result && !Array.isArray(result) && result._id) {
//         // server returned the created doc directly
//         setIncomes((prev) => [result, ...prev]);
//       } else {
//         // nothing to push — refetch might be needed, but keep UX simple
//         // Optionally: refetch incomes here
//       }

//       // If backend returned a budget summary, use it to update UI
//       const summary = result.summary;
//       if (summary) {
//         try {
//           // store it as fallback
//           localStorage.setItem("latestBudgetSummary", JSON.stringify(summary));
//         } catch (e) {
//           // ignore localStorage errors
//         }

//         // dispatch a global event so Budget component can listen
//         try {
//           window.dispatchEvent(new CustomEvent("budgetSummaryUpdated", { detail: summary }));
//         } catch (e) {
//           // older browsers fallback
//           // no-op
//         }

//         // Alert when totalIncome is zero (per your requirement)
//         if (typeof summary.totalIncome !== "undefined" && Number(summary.totalIncome) === 0) {
//           alert("Your total income for this month is 0. Please add income.");
//         }
//       }

//       // Reset form
//       setFormData({
//         amount: "",
//         category: "",
//         description: "",
//         date: new Date().toISOString().split("T")[0],
//       });
//       setShowForm(false);
//     } catch (error) {
//       console.error("Error adding income:", error);
//       alert(error.message || "Failed to add income. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const formatDate = (dateString) =>
//     new Date(dateString).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center gap-3 mb-2">
//           <div className="p-2 bg-emerald-500 rounded-xl shadow-lg">
//             <TrendingUp className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-4xl font-bold text-gray-800">Income Tracker</h1>
//         </div>
//         <p className="text-gray-600 ml-14">Track and manage your income categories</p>
//       </div>

//       {/* Add Income Button */}
//       <div className="mb-8">
//         <button
//           onClick={() => setShowForm(!showForm)}
//           className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
//         >
//           <Plus className="w-5 h-5" />
//           Add New Income
//         </button>
//       </div>

//       {/* Add Income Form */}
//       {showForm && (
//         <div className="mb-8 bg-white rounded-2xl shadow-xl p-6 border border-emerald-100">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Income</h2>
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Amount *</label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <DollarSign className="w-5 h-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="number"
//                     step="0.01"
//                     required
//                     value={formData.amount}
//                     onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
//                     className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
//                     placeholder="0.00"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <Calendar className="w-5 h-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="date"
//                     required
//                     value={formData.date}
//                     onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//                     className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">category *</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <Briefcase className="w-5 h-5 text-gray-400" />
//                 </div>
//                 <select
//                   required
//                   value={formData.category}
//                   onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                   className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none bg-white text-gray-700"
//                 >
//                   <option value="">Select Income category</option>
//                   <option value="Salary">Salary</option>
//                   <option value="Freelance">Freelance</option>
//                   <option value="Business">Business</option>
//                   <option value="Investment">Investment</option>
//                   <option value="Rental Income">Rental</option>
//                   <option value="Commission">Commission</option>
//                   <option value="Pension">Pension</option>
//                   <option value="Others">Others</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
//               <textarea
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 rows={3}
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none resize-none"
//                 placeholder="Additional details (optional)"
//               />
//             </div>

//             <div className="flex gap-3 pt-2">
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//               >
//                 {submitting ? "Adding..." : "Add Income"}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setShowForm(false)}
//                 className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Recent Income */}
//       <div>
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Income</h2>

//         {loading ? (
//           <div className="flex items-center justify-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
//           </div>
//         ) : incomes.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
//               <TrendingUp className="w-8 h-8 text-gray-400" />
//             </div>
//             <p className="text-gray-500 text-lg">No income entries yet</p>
//             <p className="text-gray-400 text-sm mt-2">Add your first income to get started</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {incomes.map((income) => (
//               <div
//                 key={income._id}
//                 className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//               >
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg">
//                         <Briefcase className="w-5 h-5 text-emerald-600" />
//                       </div>
//                       <div>
//                         <h3 className="text-xl font-bold text-gray-800">{income.category}</h3>
//                         <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
//                           <Calendar className="w-4 h-4" />
//                           {formatDate(income.date)}
//                         </div>
//                       </div>
//                     </div>
//                     {income.description && <p className="text-gray-600 mt-3 ml-11 leading-relaxed">{income.description}</p>}
//                   </div>
//                   <div className="text-right ml-4">
//                     <div className="text-3xl font-bold text-emerald-600">{income.amount}</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import {
  Plus,
  TrendingUp,
  Calendar,
  IndianRupee,
  Briefcase,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";

export default function Income() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState("");

  // ✅ helper to format in Indian rupees
  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  // Fetch authenticated user from token
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userData = decoded.user || decoded;
        if (userData && userData._id) setUserId(userData._id);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchIncomes = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);

      try {
        const res = await fetch(
          `http://localhost:8000/income?user_id=${userId}`
        );
        if (!res.ok) throw new Error("Failed to fetch incomes");

        const data = await res.json();

        if (Array.isArray(data)) {
          setIncomes(data);
        } else if (Array.isArray(data.incomes)) {
          setIncomes(data.incomes);
        } else if (Array.isArray(data.income)) {
          setIncomes(data.income);
        } else {
          setIncomes(data || []);
        }
      } catch (err) {
        console.error(err);
        setIncomes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomes();
  }, [userId]);

  // Add new income
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!userId) {
        alert("User not authenticated");
        return;
      }

      const res = await fetch("http://localhost:8000/income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
          date: formData.date,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        const msg = result?.message || "Failed to add income";
        throw new Error(msg);
      }

      if (result.income) {
        setIncomes((prev) => [result.income, ...prev]);
      } else if (result?.incomeAdded) {
        setIncomes((prev) => [result.incomeAdded, ...prev]);
      } else if (result && !Array.isArray(result) && result._id) {
        setIncomes((prev) => [result, ...prev]);
      }
      alert("Income added successfully.");

      const summary = result.summary;
      if (summary) {
        try {
          localStorage.setItem("latestBudgetSummary", JSON.stringify(summary));
        } catch (e) {}

        try {
          window.dispatchEvent(
            new CustomEvent("budgetSummaryUpdated", { detail: summary })
          );
        } catch (e) {}

        if (
          typeof summary.totalIncome !== "undefined" &&
          Number(summary.totalIncome) === 0
        ) {
          alert("Your total income for this month is 0. Please add income.");
        }
      }

      setFormData({
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding income:", error);
      alert(error.message || "Failed to add income. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  // const totalIncome = incomes.reduce(
  //   (sum, inc) => sum + Number(inc.amount || 0),
  //   0
  // );

  const now = new Date();
  const currentMonth = now.getMonth(); // 0–11
  const currentYear = now.getFullYear();

  const totalMonthIncome = incomes
  .filter((inc) => {
    const d = new Date(inc.date);
    return (
      d.getMonth() === currentMonth &&
      d.getFullYear() === currentYear
    );
  })
  .reduce((sum, inc) => sum + Number(inc.amount || 0), 0);


  return (
    // <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900">
    <div
      className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8"
      style={{
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Income Overview</span>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-400 shadow-md">
              <IndianRupee className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Income Tracker
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Add and review all of your income in one clean view.
              </p>
              <div className="mt-2 h-1 w-24 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400" />
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="rounded-2xl bg-white/90 border border-slate-200 px-5 py-4 shadow-md min-w-[230px]">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Total income this month
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600">
            {formatCurrency(totalMonthIncome)}
          </p>
          {/* <p className="mt-1 text-xs text-slate-500">
            Based on all entries you&apos;ve added.
          </p> */}
        </div>
      </div>

      {/* Add Income Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold bg-gradient-to-r from-teal-500 via-emerald-400 to-lime-400 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          {showForm ? "Close Form" : "Add New Income"}
        </button>
      </div>

      {/* Add Income Form */}
      {showForm && (
        <div className="mb-10 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-sm">
              +
            </span>
            Add Income
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Amount *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <IndianRupee className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                    placeholder="₹ 0.00"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase className="w-5 h-5 text-slate-400" />
                </div>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all outline-none bg-white text-slate-800"
                >
                  <option value="">Select income category</option>
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Business">Business</option>
                  <option value="Investment">Investment</option>
                  <option value="Rental Income">Rental</option>
                  <option value="Commission">Commission</option>
                  <option value="Pension">Pension</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all outline-none resize-none text-slate-800"
                placeholder="Add some details (optional)"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-teal-500 via-emerald-400 to-lime-400 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitting ? "Adding..." : "Add Income"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-xl font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recent Income */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-2xl font-semibold text-slate-800">Recent Income</h2>
        {incomes.length > 0 && (
          <span className="rounded-full bg-white border border-slate-200 px-3 py-1 text-xs text-slate-600">
            {"3"} entr{incomes.length === 1 ? "y" : "ies"}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-400 border-t-transparent" />
        </div>
      ) : incomes.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 p-12 text-center shadow-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
            <TrendingUp className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-700 text-lg font-medium">
            No income entries yet
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Add your first income to start building your money story.
          </p>
        </div>
      ) : (
        <div className="space-y-4 pb-6">
          {incomes.slice(0, 3).map((income) => (
            <div
              key={income._id}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-md hover:shadow-lg p-5 sm:p-6 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="p-2.5 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-xl">
                      <Briefcase className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {income.category || "Income"}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(income.date)}
                        </span>
                        {income.description && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1">
                            Description added
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {income.description && (
                    <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                      {income.description}
                    </p>
                  )}
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-600 tracking-tight">
                    {formatCurrency(income.amount)}
                  </div>
                  <p className="mt-1 text-xs text-slate-500 uppercase tracking-wide">
                    Amount
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    // </div>
  );
}
