"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { web3Service } from "../../../services/web3/web3IntegrationService";
import { useToast } from "../../../providers/ToastProvider";
import { LoadingButton, LoadingOverlay } from "../../../components/ui/Loading";
import {
  CalendarIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const CreateChallengePage = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { showSuccess, showError, showWarning } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "fitness",
    challengeType: "community",
    stakeAmount: "",
    deadline: "",
    maxParticipants: "",
    proofRequired: "",
    verifiers: [] as string[],
    allowedParticipants: [] as string[],
    requiresFollow: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    "fitness",
    "education",
    "productivity",
    "health",
    "creativity",
    "social",
    "environment",
    "finance",
    "technology",
    "personal_development",
  ];

  const challengeTypes = [
    {
      value: "community",
      label: "Community Challenge",
      description: "Open to all community members",
    },
    {
      value: "custom",
      label: "Custom Challenge",
      description: "Private challenge for selected participants",
    },
    {
      value: "community_service",
      label: "Community Service",
      description: "No stake required, focuses on social good",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleArrayInput = (name: string, value: string) => {
    const items = value.split(",").map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [name]: items }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required";
    } else if (new Date(formData.deadline) <= new Date()) {
      newErrors.deadline = "Deadline must be in the future";
    }

    if (formData.challengeType !== "community_service") {
      if (!formData.stakeAmount || parseFloat(formData.stakeAmount) <= 0) {
        newErrors.stakeAmount = "Valid stake amount is required";
      }
    }

    if (!formData.maxParticipants || parseInt(formData.maxParticipants) <= 0) {
      newErrors.maxParticipants = "Valid participant limit is required";
    }

    if (!formData.proofRequired.trim()) {
      newErrors.proofRequired = "Proof requirement description is required";
    }

    if (formData.challengeType === "custom" && formData.verifiers.length === 0) {
      newErrors.verifiers = "Custom challenges require at least one verifier";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      showWarning("Wallet Required", "Please connect your wallet to create a challenge");
      return;
    }

    if (!validateForm()) {
      showError("Form Validation Failed", "Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare challenge data for contract
      const challengeData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        challengeType: formData.challengeType,
        deadline: formData.deadline,
        maxParticipants: parseInt(formData.maxParticipants) || 100,
        stakeAmount: formData.challengeType === "community_service" ? "0" : formData.stakeAmount,
        proofRequired: formData.proofRequired,
        verifiers: formData.verifiers,
        allowedParticipants: formData.allowedParticipants,
        requiresFollow: formData.requiresFollow,
      };

      console.log("Creating challenge with data:", challengeData);

      // Create challenge via contract
      const result = await web3Service.createChallenge(challengeData, address!);
      
      if (result) {
        showSuccess(
          "Challenge Created Successfully!", 
          `Your challenge has been created. Transaction: ${result.slice(0, 10)}...`
        );
        // Redirect to challenges page
        setTimeout(() => router.push("/challenges"), 2000);
      } else {
        throw new Error("Failed to create challenge - no transaction hash returned");
      }
    } catch (error) {
      console.error("Error creating challenge:", error);
      
      if (error instanceof Error) {
        if (error.message.includes("ENS subdomain")) {
          showError(
            "ENS Subdomain Required", 
            "You need an ENS subdomain assigned by admin to create challenges. Please contact support."
          );
        } else if (error.message.includes("user rejected")) {
          showWarning("Transaction Rejected", "You cancelled the transaction. Please try again.");
        } else if (error.message.includes("insufficient funds")) {
          showError("Insufficient Funds", "You don't have enough funds for this transaction.");
        } else {
          showError("Challenge Creation Failed", error.message);
        }
      } else {
        showError("Unknown Error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to create a challenge
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <LoadingOverlay isLoading={isLoading} text="Creating your challenge...">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-8 border-b border-gray-200">
              <h1 className="text-3xl font-bold text-gray-900">
                Create New Challenge
              </h1>
              <p className="text-gray-600 mt-2">
                Set up a challenge to help others achieve their goals through accountability
              </p>
            </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Challenge Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., Daily Workout Challenge"
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Describe the challenge, what participants need to do, and what success looks like..."
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.replace("_", " ").charAt(0).toUpperCase() + category.slice(1).replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Challenge Type
                    </label>
                    <select
                      name="challengeType"
                      value={formData.challengeType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {challengeTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Challenge Type Description */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex">
                    <InformationCircleIcon className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      {challengeTypes.find(type => type.value === formData.challengeType)?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Challenge Settings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Challenge Settings
              </h2>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CalendarIcon className="w-4 h-4 inline mr-1" />
                      Deadline *
                    </label>
                    <input
                      type="datetime-local"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.deadline ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.deadline && (
                      <p className="text-red-600 text-sm mt-1">{errors.deadline}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <UserGroupIcon className="w-4 h-4 inline mr-1" />
                      Max Participants *
                    </label>
                    <input
                      type="number"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      min="1"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.maxParticipants ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g., 50"
                    />
                    {errors.maxParticipants && (
                      <p className="text-red-600 text-sm mt-1">{errors.maxParticipants}</p>
                    )}
                  </div>
                </div>

                {formData.challengeType !== "community_service" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CurrencyDollarIcon className="w-4 h-4 inline mr-1" />
                      Stake Amount (ETH) *
                    </label>
                    <input
                      type="number"
                      name="stakeAmount"
                      value={formData.stakeAmount}
                      onChange={handleInputChange}
                      step="0.001"
                      min="0.001"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.stakeAmount ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g., 0.1"
                    />
                    {errors.stakeAmount && (
                      <p className="text-red-600 text-sm mt-1">{errors.stakeAmount}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      Amount participants must stake to join the challenge
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proof Requirements *
                  </label>
                  <textarea
                    name="proofRequired"
                    value={formData.proofRequired}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.proofRequired ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Describe what participants need to submit as proof (e.g., daily photos, completion certificates, workout logs)..."
                  />
                  {errors.proofRequired && (
                    <p className="text-red-600 text-sm mt-1">{errors.proofRequired}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            {(formData.challengeType === "custom" || formData.challengeType === "community") && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Advanced Settings
                </h2>
                <div className="space-y-6">
                  {formData.challengeType === "custom" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Verifiers (ENS or Addresses) *
                        </label>
                        <textarea
                          placeholder="Enter ENS names or addresses separated by commas..."
                          onChange={(e) => handleArrayInput("verifiers", e.target.value)}
                          rows={3}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.verifiers ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.verifiers && (
                          <p className="text-red-600 text-sm mt-1">{errors.verifiers}</p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">
                          People who can verify proof submissions for this challenge
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Allowed Participants (Optional)
                        </label>
                        <textarea
                          placeholder="Enter ENS names or addresses separated by commas (leave empty for open access)..."
                          onChange={(e) => handleArrayInput("allowedParticipants", e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                          Specific people who can join this challenge (leave empty to allow followers)
                        </p>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="requiresFollow"
                          checked={formData.requiresFollow}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                          Require participants to follow you (via EFP)
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={isLoading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <LoadingButton
                  isLoading={isLoading}
                  loadingText="Creating Challenge..."
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Challenge
                </LoadingButton>
              </div>
            </div>
          </form>
        </div>
        </LoadingOverlay>
      </div>
    </div>
  );
};

export default CreateChallengePage;
