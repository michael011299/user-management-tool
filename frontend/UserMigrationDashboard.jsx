import React, { useState, useEffect } from "react";
import {
  UserPlus,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader,
  Shield,
  Database,
  Search,
  Clock,
  Users,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

export default function UserMigrationDashboard() {
  const [formData, setFormData] = useState({
    clientName: "",
    moveType: "migration",
    newEmail: "",
    offboardEmail: "",
    gaAccountId: "",
    gtmAccountId: "",
    gtmContainerId: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [findResult, setFindResult] = useState(null);
  const [accountStats, setAccountStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/migrations?limit=50");
      const data = await response.json();
      if (data.success) {
        setHistory(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const fetchAccountStats = async () => {
    setLoadingStats(true);
    try {
      const response = await fetch("http://localhost:3000/api/accounts/stats");
      const data = await response.json();
      if (data.success) {
        setAccountStats(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch account stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory]);

  useEffect(() => {
    if (showStats) {
      fetchAccountStats();
    }
  }, [showStats]);

  const handleFind = async () => {
    setLoading(true);
    setError(null);
    setFindResult(null);

    if (!formData.gaAccountId && !formData.gtmAccountId && !formData.clientName) {
      setError("Please provide at least one search criteria (Client Name, GA ID, or GTM ID)");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = "http://localhost:3000/api/find";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName: formData.clientName,
          gaAccountId: formData.gaAccountId,
          gtmAccountId: formData.gtmAccountId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to find account");
      }

      setFindResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setFindResult(null);

    // Validation
    if (!formData.clientName.trim()) {
      setError("Client name is required");
      setLoading(false);
      return;
    }

    if (formData.moveType === "migration" && !formData.newEmail.trim()) {
      setError("New email address is required for migration");
      setLoading(false);
      return;
    }

    if (formData.moveType === "offboard" && !formData.offboardEmail.trim()) {
      setError("Offboard email is required for offboard operations");
      setLoading(false);
      return;
    }

    if (!formData.gaAccountId && !formData.gtmAccountId) {
      setError("Please provide at least one account ID (GA or GTM)");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = "http://localhost:3000/api/migrate";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process migration");
      }

      setResult(data);

      if (showHistory) {
        fetchHistory();
      }

      // Refresh stats if showing
      if (showStats) {
        fetchAccountStats();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      clientName: "",
      moveType: "migration",
      newEmail: "",
      offboardEmail: "",
      gaAccountId: "",
      gtmAccountId: "",
      gtmContainerId: "",
    });
    setResult(null);
    setError(null);
    setFindResult(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCapacityStatus = (count, limit) => {
    const percentage = (count / limit) * 100;
    if (percentage >= 90)
      return { color: "red", label: "Critical", bg: "bg-red-100", border: "border-red-500", text: "text-red-800" };
    if (percentage >= 75)
      return {
        color: "orange",
        label: "High",
        bg: "bg-orange-100",
        border: "border-orange-500",
        text: "text-orange-800",
      };
    if (percentage >= 50)
      return {
        color: "yellow",
        label: "Medium",
        bg: "bg-yellow-100",
        border: "border-yellow-500",
        text: "text-yellow-800",
      };
    return { color: "green", label: "Good", bg: "bg-green-100", border: "border-green-500", text: "text-green-800" };
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6'>
      <div className='max-w-5xl mx-auto space-y-6'>
        {/* Main Form Card */}
        <div className='bg-white rounded-2xl shadow-2xl p-8'>
          {/* Header */}
          <div className='flex items-center gap-3 mb-2'>
            <RefreshCw className='w-8 h-8 text-indigo-600' />
            <h1 className='text-3xl font-bold text-gray-800'>User Access Manager</h1>
          </div>
          <div className='flex items-center gap-2 mb-8'>
            <Shield className='w-5 h-5 text-green-600' />
            <p className='text-sm text-gray-600'>
              Automated user migration with full access permissions • All operations tracked in database
            </p>
          </div>

          <div className='space-y-6'>
            {/* Operation Type Section */}
            <div className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 space-y-4'>
              <h2 className='text-xl font-semibold text-gray-800 flex items-center gap-2'>
                <Database className='w-5 h-5' />
                Operation Type
              </h2>

              <div className='grid grid-cols-3 gap-4'>
                <button
                  onClick={() => setFormData((prev) => ({ ...prev, moveType: "find" }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.moveType === "find"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className='flex items-center gap-2 justify-center'>
                    <Search className={`w-5 h-5 ${formData.moveType === "find" ? "text-blue-600" : "text-gray-600"}`} />
                    <span
                      className={`font-semibold ${formData.moveType === "find" ? "text-blue-900" : "text-gray-700"}`}
                    >
                      Find
                    </span>
                  </div>
                  <p className='text-xs text-gray-600 mt-2'>Discover account access</p>
                </button>

                <button
                  onClick={() => setFormData((prev) => ({ ...prev, moveType: "migration" }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.moveType === "migration"
                      ? "border-indigo-500 bg-indigo-50 shadow-md"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className='flex items-center gap-2 justify-center'>
                    <RefreshCw
                      className={`w-5 h-5 ${formData.moveType === "migration" ? "text-indigo-600" : "text-gray-600"}`}
                    />
                    <span
                      className={`font-semibold ${
                        formData.moveType === "migration" ? "text-indigo-900" : "text-gray-700"
                      }`}
                    >
                      Migration
                    </span>
                  </div>
                  <p className='text-xs text-gray-600 mt-2'>Existing clients - swap users</p>
                </button>

                <button
                  onClick={() => setFormData((prev) => ({ ...prev, moveType: "offboard" }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.moveType === "offboard"
                      ? "border-red-500 bg-red-50 shadow-md"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className='flex items-center gap-2 justify-center'>
                    <UserPlus
                      className={`w-5 h-5 ${formData.moveType === "offboard" ? "text-red-600" : "text-gray-600"}`}
                    />
                    <span
                      className={`font-semibold ${formData.moveType === "offboard" ? "text-red-900" : "text-gray-700"}`}
                    >
                      Offboard
                    </span>
                  </div>
                  <p className='text-xs text-gray-600 mt-2'>Dead clients - add offboard</p>
                </button>
              </div>
            </div>

            {/* Client & User Information - Only show for migration/offboard */}
            {formData.moveType !== "find" && (
              <div className='bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 space-y-4'>
                <h2 className='text-xl font-semibold text-gray-800 flex items-center gap-2'>
                  <UserPlus className='w-5 h-5' />
                  Client & User Information
                </h2>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Client Name *</label>
                    <input
                      type='text'
                      name='clientName'
                      value={formData.clientName}
                      onChange={(e) => handleInputChange(e.target)}
                      placeholder='e.g., Acme Corporation'
                      className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all'
                    />
                  </div>

                  {/* New User Email - Only show for migration */}
                  {formData.moveType === "migration" && (
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
                        <UserPlus className='w-4 h-4 text-green-600' />
                        New User Email *
                      </label>
                      <input
                        type='email'
                        name='newEmail'
                        value={formData.newEmail}
                        onChange={(e) => handleInputChange(e.target)}
                        placeholder='newuser@example.com'
                        className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all'
                      />
                    </div>
                  )}

                  {/* Offboard Email - Only show for offboard type */}
                  {formData.moveType === "offboard" && (
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
                        <Shield className='w-4 h-4 text-red-600' />
                        Offboard Account Email *
                      </label>
                      <input
                        type='email'
                        name='offboardEmail'
                        value={formData.offboardEmail}
                        onChange={(e) => handleInputChange(e.target)}
                        placeholder='offboard@agency.com'
                        className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all'
                      />
                      <p className='text-xs text-gray-600 mt-1'>
                        This account will be added for dead clients who are no longer active
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Client Name for Find - Only show for find */}
            {formData.moveType === "find" && (
              <div className='bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 space-y-4'>
                <h2 className='text-xl font-semibold text-gray-800 flex items-center gap-2'>
                  <Search className='w-5 h-5' />
                  Search Criteria
                </h2>
                <p className='text-sm text-gray-600'>Provide client name and/or account IDs to find access</p>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Client Name (Optional)</label>
                  <input
                    type='text'
                    name='clientName'
                    value={formData.clientName}
                    onChange={(e) => handleInputChange(e.target)}
                    placeholder='e.g., Acme Corporation'
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                  />
                  <p className='text-xs text-gray-600 mt-1'>
                    Helps identify the correct account when multiple matches exist
                  </p>
                </div>
              </div>
            )}

            {/* Account IDs Section */}
            <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 space-y-4'>
              <h2 className='text-xl font-semibold text-gray-800'>Account Information</h2>
              <p className='text-sm text-gray-600'>System will automatically find which agency account has access</p>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Google Analytics Account ID</label>
                  <input
                    type='text'
                    name='gaAccountId'
                    value={formData.gaAccountId}
                    onChange={(e) => handleInputChange(e.target)}
                    placeholder='e.g., 123456789'
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all'
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>GTM Account ID</label>
                    <input
                      type='text'
                      name='gtmAccountId'
                      value={formData.gtmAccountId}
                      onChange={(e) => handleInputChange(e.target)}
                      placeholder='e.g., 987654321'
                      className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>GTM Container ID</label>
                    <input
                      type='text'
                      name='gtmContainerId'
                      value={formData.gtmContainerId}
                      onChange={(e) => handleInputChange(e.target)}
                      placeholder='e.g., 111222333'
                      className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4'>
              {formData.moveType === "find" ? (
                <button
                  onClick={handleFind}
                  disabled={loading}
                  className='flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2'
                >
                  {loading ? (
                    <>
                      <Loader className='w-5 h-5 animate-spin' />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className='w-5 h-5' />
                      Find Account
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`flex-1 bg-gradient-to-r ${
                    formData.moveType === "offboard"
                      ? "from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                      : "from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  } disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <Loader className='w-5 h-5 animate-spin' />
                      Processing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className='w-5 h-5' />
                      {formData.moveType === "migration" ? "Migrate User" : "Offboard Client"}
                    </>
                  )}
                </button>
              )}

              <button
                onClick={handleReset}
                className='px-6 py-4 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-all'
              >
                Reset
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className='mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg'>
              <div className='flex items-center gap-2'>
                <XCircle className='w-5 h-5 text-red-500' />
                <h3 className='font-semibold text-red-800'>Error</h3>
              </div>
              <p className='text-red-700 mt-2'>{error}</p>
            </div>
          )}

          {/* Capacity Warning Display */}
          {result?.warnings && result.warnings.length > 0 && (
            <div className='mt-6 bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg'>
              <div className='flex items-center gap-2 mb-2'>
                <AlertTriangle className='w-5 h-5 text-orange-500' />
                <h3 className='font-semibold text-orange-800'>Capacity Warnings</h3>
              </div>
              <div className='space-y-2'>
                {result.warnings.map((warning, idx) => (
                  <div key={idx} className='bg-white p-3 rounded border border-orange-200'>
                    <p className='text-sm text-orange-800'>{warning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Find Result Display */}
          {findResult && (
            <div className='mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg'>
              <div className='flex items-center gap-2 mb-3'>
                <Search className='w-5 h-5 text-blue-500' />
                <h3 className='font-semibold text-blue-800'>Account Found!</h3>
              </div>

              <div className='bg-white p-4 rounded-lg border border-blue-200 mb-3'>
                <p className='text-sm font-bold text-blue-900'>
                  Agency Account: <span className='text-blue-700'>{findResult.agencyAccount}</span>
                </p>
                {findResult.matchedBy && (
                  <p className='text-xs text-blue-700 mt-1'>Matched by: {findResult.matchedBy}</p>
                )}
              </div>

              {findResult.users?.gtm && findResult.users.gtm.length > 0 && (
                <div className='bg-white p-4 rounded-lg border border-blue-200 mb-3'>
                  <p className='text-sm font-bold text-gray-800 mb-2'>GTM Users ({findResult.users.gtm.length}):</p>
                  <div className='space-y-1'>
                    {findResult.users.gtm.map((user, idx) => (
                      <div key={idx} className='text-sm text-gray-700 flex items-center gap-2'>
                        <span className='font-medium'>{user.email}</span>
                        <span className='text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded'>{user.permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {findResult.users?.ga && findResult.users.ga.length > 0 && (
                <div className='bg-white p-4 rounded-lg border border-blue-200'>
                  <p className='text-sm font-bold text-gray-800 mb-2'>GA Users ({findResult.users.ga.length}):</p>
                  <div className='space-y-1'>
                    {findResult.users.ga.map((user, idx) => (
                      <div key={idx} className='text-sm text-gray-700'>
                        <span className='font-medium'>{user.email}</span>
                        <div className='text-xs text-gray-600 ml-4'>{user.permissions.join(", ")}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Migration Success Display */}
          {result && result.results && (
            <div className='mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg'>
              <div className='flex items-center gap-2 mb-3'>
                <CheckCircle className='w-5 h-5 text-green-500' />
                <h3 className='font-semibold text-green-800'>
                  {formData.moveType === "migration" ? "Migration" : "Offboarding"} Completed!
                </h3>
              </div>

              <div className='bg-blue-50 border border-blue-200 p-3 rounded-lg mb-3'>
                <p className='text-sm text-blue-900'>
                  <span className='font-bold'>Migration ID:</span> {result.results?.moveId}
                </p>
                <p className='text-sm text-blue-900'>
                  <span className='font-bold'>Agency Account:</span> {result.results?.agencyAccount}
                </p>
              </div>

              <div className='space-y-3'>
                {result.results?.gtm?.remove && (
                  <div className='bg-white p-4 rounded-lg border-l-4 border-red-300'>
                    <p className='text-sm font-bold text-gray-800 mb-1'>GTM - Removed Old User</p>
                    <p className='text-sm text-gray-700'>{result.results.gtm.remove.message}</p>
                  </div>
                )}

                {result.results?.gtm?.add && (
                  <div className='bg-white p-4 rounded-lg border-l-4 border-green-300'>
                    <p className='text-sm font-bold text-gray-800 mb-1'>GTM - Added New User</p>
                    <p className='text-sm text-gray-700'>{result.results.gtm.add.message}</p>
                    <p className='text-xs text-green-600 mt-1 flex items-center gap-1'>
                      <Shield className='w-3 h-3' />
                      Full management permissions
                    </p>
                  </div>
                )}

                {result.results?.gtm?.addOffboard && (
                  <div className='bg-white p-4 rounded-lg border-l-4 border-orange-300'>
                    <p className='text-sm font-bold text-gray-800 mb-1'>GTM - Added Offboard Account</p>
                    <p className='text-sm text-gray-700'>{result.results.gtm.addOffboard.message}</p>
                  </div>
                )}

                {result.results?.ga?.remove && (
                  <div className='bg-white p-4 rounded-lg border-l-4 border-red-300'>
                    <p className='text-sm font-bold text-gray-800 mb-1'>GA - Removed Old User</p>
                    <p className='text-sm text-gray-700'>{result.results.ga.remove.message}</p>
                  </div>
                )}

                {result.results?.ga?.add && (
                  <div className='bg-white p-4 rounded-lg border-l-4 border-green-300'>
                    <p className='text-sm font-bold text-gray-800 mb-1'>GA - Added New User</p>
                    <p className='text-sm text-gray-700'>{result.results.ga.add.message}</p>
                    <p className='text-xs text-green-600 mt-1 flex items-center gap-1'>
                      <Shield className='w-3 h-3' />
                      All permissions granted
                    </p>
                  </div>
                )}

                {result.results?.ga?.addOffboard && (
                  <div className='bg-white p-4 rounded-lg border-l-4 border-orange-300'>
                    <p className='text-sm font-bold text-gray-800 mb-1'>GA - Added Offboard Account</p>
                    <p className='text-sm text-gray-700'>{result.results.ga.addOffboard.message}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Account Capacity Dashboard Toggle */}
        <button
          onClick={() => setShowStats(!showStats)}
          className='w-full bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all flex items-center justify-between'
        >
          <div className='flex items-center gap-2'>
            <Users className='w-5 h-5 text-purple-600' />
            <span className='font-semibold text-gray-800'>Account Capacity Dashboard</span>
            {accountStats && (
              <span className='text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded'>13 Accounts Monitored</span>
            )}
          </div>
          <span className='text-gray-500'>{showStats ? "▼" : "▶"}</span>
        </button>

        {/* Account Capacity Dashboard */}
        {showStats && (
          <div className='bg-white rounded-2xl shadow-2xl p-6'>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                  <TrendingUp className='w-6 h-6 text-purple-600' />
                  Account Capacity Overview
                </h2>
                <p className='text-sm text-gray-600 mt-1'>Real-time monitoring of all agency accounts</p>
              </div>
              <button
                onClick={fetchAccountStats}
                disabled={loadingStats}
                className='flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-all'
              >
                <RefreshCw className={`w-4 h-4 ${loadingStats ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

            {loadingStats ? (
              <div className='flex items-center justify-center py-12'>
                <Loader className='w-8 h-8 animate-spin text-purple-600' />
              </div>
            ) : accountStats ? (
              <div className='space-y-6'>
                {/* Summary Stats */}
                <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                  <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200'>
                    <p className='text-sm text-blue-700 font-medium'>Total GTM Users</p>
                    <p className='text-2xl font-bold text-blue-900 mt-1'>{accountStats.summary?.totalGTMUsers || 0}</p>
                  </div>
                  <div className='bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200'>
                    <p className='text-sm text-green-700 font-medium'>Total GA Users</p>
                    <p className='text-2xl font-bold text-green-900 mt-1'>{accountStats.summary?.totalGAUsers || 0}</p>
                  </div>
                  <div className='bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200'>
                    <p className='text-sm text-orange-700 font-medium'>High Capacity</p>
                    <p className='text-2xl font-bold text-orange-900 mt-1'>{accountStats.summary?.highCapacity || 0}</p>
                  </div>
                  <div className='bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200'>
                    <p className='text-sm text-red-700 font-medium'>Critical</p>
                    <p className='text-2xl font-bold text-red-900 mt-1'>{accountStats.summary?.critical || 0}</p>
                  </div>
                </div>

                {/* Account Details */}
                <div className='space-y-4'>
                  <h3 className='font-semibold text-gray-800 text-lg'>Individual Account Status</h3>
                  {accountStats.accounts?.map((account, idx) => {
                    const gtmStatus = getCapacityStatus(account.gtm.count, account.gtm.limit);
                    const gaStatus = getCapacityStatus(account.ga.count, account.ga.limit);
                    const isWarning = gtmStatus.label !== "Good" || gaStatus.label !== "Good";

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border-2 ${
                          isWarning ? "border-orange-300 bg-orange-50" : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <div>
                            <h4 className='font-bold text-gray-800'>{account.email}</h4>
                            <p className='text-xs text-gray-600 mt-1'>
                              Last checked: {formatDate(account.lastChecked)}
                            </p>
                          </div>
                          {isWarning && <AlertTriangle className='w-5 h-5 text-orange-500' />}
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          {/* GTM Stats */}
                          <div className={`p-3 rounded-lg border ${gtmStatus.border} ${gtmStatus.bg}`}>
                            <div className='flex items-center justify-between mb-2'>
                              <span className='text-sm font-semibold text-gray-700'>Google Tag Manager</span>
                              <span className={`text-xs px-2 py-1 rounded font-bold ${gtmStatus.text}`}>
                                {gtmStatus.label}
                              </span>
                            </div>
                            <div className='flex items-baseline gap-2'>
                              <span className='text-2xl font-bold text-gray-900'>{account.gtm.count}</span>
                              <span className='text-sm text-gray-600'>/ {account.gtm.limit} users</span>
                            </div>
                            <div className='mt-2 bg-gray-200 rounded-full h-2 overflow-hidden'>
                              <div
                                className={`h-full transition-all ${
                                  gtmStatus.color === "red"
                                    ? "bg-red-500"
                                    : gtmStatus.color === "orange"
                                    ? "bg-orange-500"
                                    : gtmStatus.color === "yellow"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                                style={{ width: `${Math.min((account.gtm.count / account.gtm.limit) * 100, 100)}%` }}
                              />
                            </div>
                            <p className='text-xs text-gray-600 mt-2'>
                              {account.gtm.limit - account.gtm.count} slots remaining
                            </p>
                          </div>

                          {/* GA Stats */}
                          <div className={`p-3 rounded-lg border ${gaStatus.border} ${gaStatus.bg}`}>
                            <div className='flex items-center justify-between mb-2'>
                              <span className='text-sm font-semibold text-gray-700'>Google Analytics</span>
                              <span className={`text-xs px-2 py-1 rounded font-bold ${gaStatus.text}`}>
                                {gaStatus.label}
                              </span>
                            </div>
                            <div className='flex items-baseline gap-2'>
                              <span className='text-2xl font-bold text-gray-900'>{account.ga.count}</span>
                              <span className='text-sm text-gray-600'>/ {account.ga.limit} users</span>
                            </div>
                            <div className='mt-2 bg-gray-200 rounded-full h-2 overflow-hidden'>
                              <div
                                className={`h-full transition-all ${
                                  gaStatus.color === "red"
                                    ? "bg-red-500"
                                    : gaStatus.color === "orange"
                                    ? "bg-orange-500"
                                    : gaStatus.color === "yellow"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                                style={{ width: `${Math.min((account.ga.count / account.ga.limit) * 100, 100)}%` }}
                              />
                            </div>
                            <p className='text-xs text-gray-600 mt-2'>
                              {account.ga.limit - account.ga.count} slots remaining
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className='text-center text-gray-500 py-8'>No account statistics available</p>
            )}
          </div>
        )}

        {/* Migration History Toggle */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className='w-full bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all flex items-center justify-between'
        >
          <div className='flex items-center gap-2'>
            <Database className='w-5 h-5 text-indigo-600' />
            <span className='font-semibold text-gray-800'>Migration History</span>
          </div>
          <span className='text-gray-500'>{showHistory ? "▼" : "▶"}</span>
        </button>

        {/* Migration History */}
        {showHistory && (
          <div className='bg-white rounded-2xl shadow-2xl p-6'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Recent Operations</h2>

            {history.length === 0 ? (
              <p className='text-gray-500 text-center py-8'>No operations recorded yet</p>
            ) : (
              <div className='space-y-3 max-h-96 overflow-y-auto'>
                {history.map((item) => (
                  <div
                    key={item.move_id}
                    className={`p-4 rounded-lg border-l-4 ${
                      item.status === "completed"
                        ? item.move_type === "offboard"
                          ? "border-orange-500 bg-orange-50"
                          : "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                    }`}
                  >
                    <div className='flex justify-between items-start mb-2'>
                      <div>
                        <p className='font-bold text-gray-800'>{item.client_name}</p>
                        <p className='text-sm text-gray-600'>
                          {item.move_type.charAt(0).toUpperCase() + item.move_type.slice(1)}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          item.status === "completed" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className='grid grid-cols-2 gap-2 text-xs text-gray-700'>
                      <div>
                        <span className='font-semibold'>ID:</span> {item.move_id}
                      </div>
                      <div>
                        <span className='font-semibold'>New:</span> {item.new_email}
                      </div>
                      {item.old_email && (
                        <div>
                          <span className='font-semibold'>Old:</span> {item.old_email}
                        </div>
                      )}
                      {item.offboard_email && (
                        <div>
                          <span className='font-semibold'>Offboard:</span> {item.offboard_email}
                        </div>
                      )}
                      {item.ga_account_id && (
                        <div>
                          <span className='font-semibold'>GA:</span> {item.ga_account_id}
                        </div>
                      )}
                      {item.gtm_account_id && (
                        <div>
                          <span className='font-semibold'>GTM:</span> {item.gtm_account_id}
                        </div>
                      )}
                    </div>

                    <div className='flex items-center gap-4 mt-2 text-xs text-gray-500'>
                      <span className='flex items-center gap-1'>
                        <Clock className='w-3 h-3' />
                        {formatDate(item.created_at)}
                      </span>
                      {item.agency_account_used && (
                        <span className='flex items-center gap-1'>
                          <Shield className='w-3 h-3' />
                          {item.agency_account_used}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info Card */}
        <div className='bg-white rounded-lg shadow-lg p-5 border-l-4 border-indigo-500'>
          <h3 className='font-bold text-indigo-900 mb-3 text-lg'>Operation Types</h3>
          <div className='space-y-3 text-sm text-gray-700'>
            <div className='flex items-start gap-2'>
              <Search className='w-5 h-5 text-blue-600 mt-0.5' />
              <div>
                <p className='font-semibold'>Find</p>
                <p className='text-xs'>Discover which agency account has access and list all current users</p>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <RefreshCw className='w-5 h-5 text-indigo-600 mt-0.5' />
              <div>
                <p className='font-semibold'>Migration</p>
                <p className='text-xs'>For existing clients: Remove old user, add new user with full permissions</p>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <UserPlus className='w-5 h-5 text-red-600 mt-0.5' />
              <div>
                <p className='font-semibold'>Offboard</p>
                <p className='text-xs'>For dead clients: Remove old user, add offboard account email only</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { UserPlus, RefreshCw, CheckCircle, XCircle, Loader, Shield, Database, Search, Clock } from "lucide-react";

export default function UserMigrationDashboard() {
  const [formData, setFormData] = useState({
    clientName: "",
    moveType: "migration",
    newEmail: "",
    offboardEmail: "",
    gaAccountId: "",
    gtmAccountId: "",
    gtmContainerId: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [findResult, setFindResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/migrations?limit=50");
      const data = await response.json();
      if (data.success) {
        setHistory(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory]);

  const handleFind = async () => {
    setLoading(true);
    setError(null);
    setFindResult(null);

    if (!formData.gaAccountId && !formData.gtmAccountId && !formData.clientName) {
      setError("Please provide at least one search criteria (Client Name, GA ID, or GTM ID)");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = "http://localhost:3000/api/find";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName: formData.clientName,
          gaAccountId: formData.gaAccountId,
          gtmAccountId: formData.gtmAccountId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to find account");
      }

      setFindResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setFindResult(null);

    // Validation
    if (!formData.clientName.trim()) {
      setError("Client name is required");
      setLoading(false);
      return;
    }

    if (formData.moveType === "migration" && !formData.newEmail.trim()) {
      setError("New email address is required for migration");
      setLoading(false);
      return;
    }

    if (formData.moveType === "offboard" && !formData.offboardEmail.trim()) {
      setError("Offboard email is required for offboard operations");
      setLoading(false);
      return;
    }

    if (!formData.gaAccountId && !formData.gtmAccountId) {
      setError("Please provide at least one account ID (GA or GTM)");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = "http://localhost:3000/api/migrate";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process migration");
      }

      setResult(data);

      if (showHistory) {
        fetchHistory();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      clientName: "",
      moveType: "migration",
      newEmail: "",
      offboardEmail: "",
      gaAccountId: "",
      gtmAccountId: "",
      gtmContainerId: "",
    });
    setResult(null);
    setError(null);
    setFindResult(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6'>
      <div className='max-w-5xl mx-auto space-y-6'>
        {/* Main Form Card */}
        <div className='bg-white rounded-2xl shadow-2xl p-8'>
          {/* Header */}
          <div className='flex items-center gap-3 mb-2'>
            <RefreshCw className='w-8 h-8 text-indigo-600' />
            <h1 className='text-3xl font-bold text-gray-800'>User Access Manager</h1>
          </div>
          <div className='flex items-center gap-2 mb-8'>
            <Shield className='w-5 h-5 text-green-600' />
            <p className='text-sm text-gray-600'>
              Automated user migration with full access permissions • All operations tracked in database
            </p>
          </div>

          <div className='space-y-6'>
            {/* Operation Type Section */}
            <div className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 space-y-4'>
              <h2 className='text-xl font-semibold text-gray-800 flex items-center gap-2'>
                <Database className='w-5 h-5' />
                Operation Type
              </h2>

              <div className='grid grid-cols-3 gap-4'>
                <button
                  onClick={() => setFormData((prev) => ({ ...prev, moveType: "find" }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.moveType === "find"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className='flex items-center gap-2 justify-center'>
                    <Search className={`w-5 h-5 ${formData.moveType === "find" ? "text-blue-600" : "text-gray-600"}`} />
                    <span
                      className={`font-semibold ${formData.moveType === "find" ? "text-blue-900" : "text-gray-700"}`}
                    >
                      Find
                    </span>
                  </div>
                  <p className='text-xs text-gray-600 mt-2'>Discover account access</p>
                </button>

                <button
                  onClick={() => setFormData((prev) => ({ ...prev, moveType: "migration" }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.moveType === "migration"
                      ? "border-indigo-500 bg-indigo-50 shadow-md"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className='flex items-center gap-2 justify-center'>
                    <RefreshCw
                      className={`w-5 h-5 ${formData.moveType === "migration" ? "text-indigo-600" : "text-gray-600"}`}
                    />
                    <span
                      className={`font-semibold ${
                        formData.moveType === "migration" ? "text-indigo-900" : "text-gray-700"
                      }`}
                    >
                      Migration
                    </span>
                  </div>
                  <p className='text-xs text-gray-600 mt-2'>Existing clients - swap users</p>
                </button>

                <button
                  onClick={() => setFormData((prev) => ({ ...prev, moveType: "offboard" }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.moveType === "offboard"
                      ? "border-red-500 bg-red-50 shadow-md"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className='flex items-center gap-2 justify-center'>
                    <UserPlus
                      className={`w-5 h-5 ${formData.moveType === "offboard" ? "text-red-600" : "text-gray-600"}`}
                    />
                    <span
                      className={`font-semibold ${formData.moveType === "offboard" ? "text-red-900" : "text-gray-700"}`}
                    >
                      Offboard
                    </span>
                  </div>
                  <p className='text-xs text-gray-600 mt-2'>Dead clients - add offboard</p>
                </button>
              </div>
            </div>

            {/* Client & User Information - Only show for migration/offboard */}
            {formData.moveType !== "find" && (
              <div className='bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 space-y-4'>
                <h2 className='text-xl font-semibold text-gray-800 flex items-center gap-2'>
                  <UserPlus className='w-5 h-5' />
                  Client & User Information
                </h2>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Client Name *</label>
                    <input
                      type='text'
                      name='clientName'
                      value={formData.clientName}
                      onChange={(e) => handleInputChange(e.target)}
                      placeholder='e.g., Acme Corporation'
                      className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all'
                    />
                  </div>

                  {/* New User Email - Only show for migration */}
                  {formData.moveType === "migration" && (
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
                        <UserPlus className='w-4 h-4 text-green-600' />
                        New User Email *
                      </label>
                      <input
                        type='email'
                        name='newEmail'
                        value={formData.newEmail}
                        onChange={(e) => handleInputChange(e.target)}
                        placeholder='newuser@example.com'
                        className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all'
                      />
                    </div>
                  )}

                  {/* Offboard Email - Only show for offboard type */}
                  {formData.moveType === "offboard" && (
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
                        <Shield className='w-4 h-4 text-red-600' />
                        Offboard Account Email *
                      </label>
                      <input
                        type='email'
                        name='offboardEmail'
                        value={formData.offboardEmail}
                        onChange={(e) => handleInputChange(e.target)}
                        placeholder='offboard@agency.com'
                        className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all'
                      />
                      <p className='text-xs text-gray-600 mt-1'>
                        This account will be added for dead clients who are no longer active
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Client Name for Find - Only show for find */}
            {formData.moveType === "find" && (
              <div className='bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 space-y-4'>
                <h2 className='text-xl font-semibold text-gray-800 flex items-center gap-2'>
                  <Search className='w-5 h-5' />
                  Search Criteria
                </h2>
                <p className='text-sm text-gray-600'>Provide client name and/or account IDs to find access</p>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Client Name (Optional)</label>
                  <input
                    type='text'
                    name='clientName'
                    value={formData.clientName}
                    onChange={(e) => handleInputChange(e.target)}
                    placeholder='e.g., Acme Corporation'
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                  />
                  <p className='text-xs text-gray-600 mt-1'>
                    Helps identify the correct account when multiple matches exist
                  </p>
                </div>
              </div>
            )}

            {/* Account IDs Section */}
            <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 space-y-4'>
              <h2 className='text-xl font-semibold text-gray-800'>Account Information</h2>
              <p className='text-sm text-gray-600'>System will automatically find which agency account has access</p>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Google Analytics Account ID</label>
                  <input
                    type='text'
                    name='gaAccountId'
                    value={formData.gaAccountId}
                    onChange={(e) => handleInputChange(e.target)}
                    placeholder='e.g., 123456789'
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all'
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>GTM Account ID</label>
                    <input
                      type='text'
                      name='gtmAccountId'
                      value={formData.gtmAccountId}
                      onChange={(e) => handleInputChange(e.target)}
                      placeholder='e.g., 987654321'
                      className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>GTM Container ID</label>
                    <input
                      type='text'
                      name='gtmContainerId'
                      value={formData.gtmContainerId}
                      onChange={(e) => handleInputChange(e.target)}
                      placeholder='e.g., 111222333'
                      className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4'>
              {formData.moveType === "find" ? (
                <button
                  onClick={handleFind}
                  disabled={loading}
                  className='flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2'
                >
                  {loading ? (
                    <>
                      <Loader className='w-5 h-5 animate-spin' />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className='w-5 h-5' />
                      Find Account
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`flex-1 bg-gradient-to-r ${
                    formData.moveType === "offboard"
                      ? "from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                      : "from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  } disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <Loader className='w-5 h-5 animate-spin' />
                      Processing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className='w-5 h-5' />
                      {formData.moveType === "migration" ? "Migrate User" : "Offboard Client"}
                    </>
                  )}
                </button>
              )}

              <button
                onClick={handleReset}
                className='px-6 py-4 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-all'
              >
                Reset
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className='mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg'>
              <div className='flex items-center gap-2'>
                <XCircle className='w-5 h-5 text-red-500' />
                <h3 className='font-semibold text-red-800'>Error</h3>
              </div>
              <p className='text-red-700 mt-2'>{error}</p>
            </div>
          )}

          {/* Find Result Display */}
          {findResult && (
            <div className='mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg'>
              <div className='flex items-center gap-2 mb-3'>
                <Search className='w-5 h-5 text-blue-500' />
                <h3 className='font-semibold text-blue-800'>Account Found!</h3>
              </div>

              <div className='bg-white p-4 rounded-lg border border-blue-200 mb-3'>
                <p className='text-sm font-bold text-blue-900'>
                  Agency Account: <span className='text-blue-700'>{findResult.agencyAccount}</span>
                </p>
                {findResult.matchedBy && (
                  <p className='text-xs text-blue-700 mt-1'>Matched by: {findResult.matchedBy}</p>
                )}
              </div>

              {findResult.users?.gtm && findResult.users.gtm.length > 0 && (
                <div className='bg-white p-4 rounded-lg border border-blue-200 mb-3'>
                  <p className='text-sm font-bold text-gray-800 mb-2'>GTM Users ({findResult.users.gtm.length}):</p>
                  <div className='space-y-1'>
                    {findResult.users.gtm.map((user, idx) => (
                      <div key={idx} className='text-sm text-gray-700 flex items-center gap-2'>
                        <span className='font-medium'>{user.email}</span>
                        <span className='text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded'>{user.permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {findResult.users?.ga && findResult.users.ga.length > 0 && (
                <div className='bg-white p-4 rounded-lg border border-blue-200'>
                  <p className='text-sm font-bold text-gray-800 mb-2'>GA Users ({findResult.users.ga.length}):</p>
                  <div className='space-y-1'>
                    {findResult.users.ga.map((user, idx) => (
                      <div key={idx} className='text-sm text-gray-700'>
                        <span className='font-medium'>{user.email}</span>
                        <div className='text-xs text-gray-600 ml-4'>{user.permissions.join(", ")}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Migration Success Display */}
          {result && (
            <div className='mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg'>
              <div className='flex items-center gap-2 mb-3'>
                <CheckCircle className='w-5 h-5 text-green-500' />
                <h3 className='font-semibold text-green-800'>
                  {formData.moveType === "migration" ? "Migration" : "Offboarding"} Completed!
                </h3>
              </div>

              <div className='bg-blue-50 border border-blue-200 p-3 rounded-lg mb-3'>
                <p className='text-sm text-blue-900'>
                  <span className='font-bold'>Migration ID:</span> {result.results?.moveId}
                </p>
                <p className='text-sm text-blue-900'>
                  <span className='font-bold'>Agency Account:</span> {result.results?.agencyAccount}
                </p>
              </div>

              <div className='space-y-3'>
                {result.results?.gtm?.remove && (
                  <div className='bg-white p-4 rounded-lg border-l-4 border-red-300'>
                    <p className='text-sm font-bold text-gray-800 mb-1'>GTM - Removed Old User</p>
                    <p className='text-sm text-gray-700'>{result.results.gtm.remove.message}</p>
                  </div>
                )}

                {result.results?.gtm?.add && (
                  <div className='bg-white p-4 rounded-lg border-l-4 border-green-300'>
                    <p className='text-sm font-bold text-gray-800 mb-1'>GTM - Added New User</p>
                    <p className='text-sm text-gray-700'>{result.results.gtm.add.message}</p>
                    <p className='text-xs text-green-600 mt-1 flex items-center gap-1'>
                      <Shield className='w-3 h-3' />
                      Full management permissions
                    </p>
                  </div>
                )}

                {result.results?.gtm?.addOffboard && (
                  <div className='bg-white p-4 rounded-lg border-l-4 border-orange-300'>
                    <p className='text-sm font-bold text-gray-800 mb-1'>GTM - Added Offboard Account</p>
                    <p className='text-sm text-gray-700'>{result.results.gtm.addOffboard.message}</p>
                  </div>
                )}

                {result.results?.ga?.remove && (
                  <div className='bg-white p-4 rounded-lg border-l-4 border-red-300'>
                    <p className='text-sm font-bold text-gray-800 mb-1'>GA - Removed Old User</p>
                    <p className='text-sm text-gray-700'>{result.results.ga.remove.message}</p>
                  </div>
                )}

                {result.results?.ga?.add && (
                  <div className='bg-white p-4 rounded-lg border-l-4 border-green-300'>
                    <p className='text-sm font-bold text-gray-800 mb-1'>GA - Added New User</p>
                    <p className='text-sm text-gray-700'>{result.results.ga.add.message}</p>
                    <p className='text-xs text-green-600 mt-1 flex items-center gap-1'>
                      <Shield className='w-3 h-3' />
                      All permissions granted
                    </p>
                  </div>
                )}

                {result.results?.ga?.addOffboard && (
                  <div className='bg-white p-4 rounded-lg border-l-4 border-orange-300'>
                    <p className='text-sm font-bold text-gray-800 mb-1'>GA - Added Offboard Account</p>
                    <p className='text-sm text-gray-700'>{result.results.ga.addOffboard.message}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Migration History Toggle */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className='w-full bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all flex items-center justify-between'
        >
          <div className='flex items-center gap-2'>
            <Database className='w-5 h-5 text-indigo-600' />
            <span className='font-semibold text-gray-800'>Migration History</span>
          </div>
          <span className='text-gray-500'>{showHistory ? "▼" : "▶"}</span>
        </button>

        {/* Migration History */}
        {showHistory && (
          <div className='bg-white rounded-2xl shadow-2xl p-6'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Recent Operations</h2>

            {history.length === 0 ? (
              <p className='text-gray-500 text-center py-8'>No operations recorded yet</p>
            ) : (
              <div className='space-y-3 max-h-96 overflow-y-auto'>
                {history.map((item) => (
                  <div
                    key={item.move_id}
                    className={`p-4 rounded-lg border-l-4 ${
                      item.status === "completed"
                        ? item.move_type === "offboard"
                          ? "border-orange-500 bg-orange-50"
                          : "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                    }`}
                  >
                    <div className='flex justify-between items-start mb-2'>
                      <div>
                        <p className='font-bold text-gray-800'>{item.client_name}</p>
                        <p className='text-sm text-gray-600'>
                          {item.move_type.charAt(0).toUpperCase() + item.move_type.slice(1)}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          item.status === "completed" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className='grid grid-cols-2 gap-2 text-xs text-gray-700'>
                      <div>
                        <span className='font-semibold'>ID:</span> {item.move_id}
                      </div>
                      <div>
                        <span className='font-semibold'>New:</span> {item.new_email}
                      </div>
                      {item.old_email && (
                        <div>
                          <span className='font-semibold'>Old:</span> {item.old_email}
                        </div>
                      )}
                      {item.offboard_email && (
                        <div>
                          <span className='font-semibold'>Offboard:</span> {item.offboard_email}
                        </div>
                      )}
                      {item.ga_account_id && (
                        <div>
                          <span className='font-semibold'>GA:</span> {item.ga_account_id}
                        </div>
                      )}
                      {item.gtm_account_id && (
                        <div>
                          <span className='font-semibold'>GTM:</span> {item.gtm_account_id}
                        </div>
                      )}
                    </div>

                    <div className='flex items-center gap-4 mt-2 text-xs text-gray-500'>
                      <span className='flex items-center gap-1'>
                        <Clock className='w-3 h-3' />
                        {formatDate(item.created_at)}
                      </span>
                      {item.agency_account_used && (
                        <span className='flex items-center gap-1'>
                          <Shield className='w-3 h-3' />
                          {item.agency_account_used}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info Card */}
        <div className='bg-white rounded-lg shadow-lg p-5 border-l-4 border-indigo-500'>
          <h3 className='font-bold text-indigo-900 mb-3 text-lg'>Operation Types</h3>
          <div className='space-y-3 text-sm text-gray-700'>
            <div className='flex items-start gap-2'>
              <Search className='w-5 h-5 text-blue-600 mt-0.5' />
              <div>
                <p className='font-semibold'>Find</p>
                <p className='text-xs'>Discover which agency account has access and list all current users</p>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <RefreshCw className='w-5 h-5 text-indigo-600 mt-0.5' />
              <div>
                <p className='font-semibold'>Migration</p>
                <p className='text-xs'>For existing clients: Remove old user, add new user with full permissions</p>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <UserPlus className='w-5 h-5 text-red-600 mt-0.5' />
              <div>
                <p className='font-semibold'>Offboard</p>
                <p className='text-xs'>For dead clients: Remove old user, add offboard account email only</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
