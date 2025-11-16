import React, { useState } from "react";
import { Layout } from "./components/layout/Layout";
import { Card } from "./components/common/Card";
import { Button } from "./components/common/Button";
import { MigrationForm } from "./components/forms/MigrationForm";
import { OffboardForm } from "./components/forms/OffboardForm";
import { FindForm } from "./components/forms/FindForm";
import { ResultDisplay } from "./components/results/ResultDisplay";
import { CapacityDashboard } from "./components/dashboard/CapacityDashboard";
import { MigrationHistory } from "./components/history/MigrationHistory";
import { useMigration } from "./hooks/useMigration";
import { validateForm } from "./utils/validators";
import { FormData, MoveType } from "./types";
import { FiArrowRight, FiUserX, FiSearch } from "react-icons/fi";

const initialFormData: FormData = {
  clientName: "",
  moveType: "migration",
  newEmail: "",
  offboardEmail: "",
  gaAccountId: "",
  gtmAccountId: "",
  gtmContainerId: "",
};

function App() {
  const [activeTab, setActiveTab] = useState("operations");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { loading, result, findResult, migrate, find, reset } = useMigration();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleMoveTypeChange = (moveType: MoveType) => {
    setFormData((prev) => ({ ...prev, moveType }));
    setErrors({});
    reset();
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (formData.moveType === "find") {
        await find(formData);
      } else {
        await migrate(formData);
      }
    } catch (err) {
      console.error("Operation failed:", err);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    reset();
  };

  const renderOperationsTab = () => (
    <div className='space-y-6'>
      <div>
        <h2 className='text-3xl font-bold text-gray-900 mb-2'>User Management Operations</h2>
        <p className='text-gray-600'>Manage Google Analytics and Tag Manager user permissions</p>
      </div>

      <div className='bg-white rounded-xl shadow-lg p-6'>
        <div className='flex flex-wrap gap-3 mb-6'>
          <Button
            variant={formData.moveType === "migration" ? "primary" : "secondary"}
            onClick={() => handleMoveTypeChange("migration")}
            icon={<FiArrowRight />}
          >
            Migration
          </Button>
          <Button
            variant={formData.moveType === "offboard" ? "primary" : "secondary"}
            onClick={() => handleMoveTypeChange("offboard")}
            icon={<FiUserX />}
          >
            Offboard
          </Button>
          <Button
            variant={formData.moveType === "find" ? "primary" : "secondary"}
            onClick={() => handleMoveTypeChange("find")}
            icon={<FiSearch />}
          >
            Find
          </Button>
        </div>

        {formData.moveType === "migration" && (
          <MigrationForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onReset={handleReset}
            loading={loading}
            errors={errors}
          />
        )}

        {formData.moveType === "offboard" && (
          <OffboardForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onReset={handleReset}
            loading={loading}
            errors={errors}
          />
        )}

        {formData.moveType === "find" && (
          <FindForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onReset={handleReset}
            loading={loading}
            errors={errors}
          />
        )}
      </div>

      <ResultDisplay migrationResult={result} findResult={findResult} />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "operations":
        return renderOperationsTab();
      case "capacity":
        return <CapacityDashboard />;
      case "history":
        return <MigrationHistory />;
      default:
        return renderOperationsTab();
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
