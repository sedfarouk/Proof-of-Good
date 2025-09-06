"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import {
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  CheckCircleIcon,
  XCircleIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { web3Service } from "../../../services/web3/web3IntegrationService";

interface Challenge {
  id: number;
  title: string;
  description: string;
  category: string;
  creator: string;
  creatorEns?: string;
  stakeAmount: string;
  deadline: number;
  maxParticipants: number;
  currentParticipants: number;
  challengeType: "community" | "custom" | "community_service";
  likes: number;
  comments: number;
  isLiked: boolean;
  proofRequired: string;
  status: "active" | "ended" | "upcoming";
  userStatus?: "not_joined" | "participating" | "submitted" | "verified" | "rejected" | "won" | "lost";
  rules: string[];
  rewards: {
    winner: string;
    participant: string;
  };
}

interface Comment {
  id: number;
  author: string;
  authorEns?: string;
  content: string;
  timestamp: number;
  likes: number;
  isLiked: boolean;
}

interface Participant {
  address: string;
  ensName?: string;
  joinedAt: number;
  proofSubmitted: boolean;
  proofStatus: "pending" | "verified" | "rejected";
  proofUrl?: string;
}

const ChallengeDetailPage = () => {
  const params = useParams();
  const { address, isConnected } = useAccount();
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofDescription, setProofDescription] = useState("");
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (params.id) {
      fetchChallengeDetails(params.id as string);
    }
  }, [params.id]);

  const fetchChallengeDetails = async (challengeId: string) => {
    try {
      // Get real challenge details from smart contract
      const challengeDetails = await web3Service.getChallengeDetails(parseInt(challengeId));
      
      if (challengeDetails) {
        // Convert Web3Service Challenge to UI Challenge format
        const uiChallenge: Challenge = {
          id: parseInt(challengeDetails.id),
          title: challengeDetails.title,
          description: challengeDetails.description,
          category: challengeDetails.category,
          creator: challengeDetails.creator,
          creatorEns: challengeDetails.ensSubdomain,
          stakeAmount: challengeDetails.stakeAmount,
          deadline: challengeDetails.deadline,
          maxParticipants: 100, // Default value
          currentParticipants: challengeDetails.participantCount,
          challengeType: challengeDetails.challengeType === 0 ? "community" : challengeDetails.challengeType === 1 ? "custom" : "community_service",
          likes: 0, // Default value
          comments: 0, // Default value
          isLiked: false, // Default value
          proofRequired: "Upload proof of completion",
          status: challengeDetails.status === 0 ? "upcoming" : challengeDetails.status === 1 ? "active" : "ended",
          userStatus: "not_joined", // Will be updated based on user participation
          rules: ["Complete the challenge requirements", "Submit valid proof", "Follow community guidelines"],
          rewards: {
            winner: challengeDetails.stakeAmount,
            participant: "0.01 ETH"
          }
        };
        
        setChallenge(uiChallenge);
        
        // Get real participants and comments from contracts
        const participantsList = await web3Service.getChallengeParticipants(parseInt(challengeId));
        const commentsList = await web3Service.getChallengeComments(parseInt(challengeId));
        
        setParticipants(participantsList);
        setComments(commentsList);
      } else {
        // No fallback data - set empty state
        setChallenge(null);
        setParticipants([]);
        setComments([]);
      }
    } catch (error) {
      console.error("Error fetching challenge details:", error);
      // Set empty state on error
      setChallenge(null);
      setParticipants([]);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChallenge = async () => {
    if (!isConnected || !challenge) return;

    setIsJoining(true);
    try {
      // Call the smart contract to join the challenge
      await web3Service.joinChallenge(challenge.id.toString(), address!);
      
      setChallenge(prev => prev ? {
        ...prev,
        currentParticipants: prev.currentParticipants + 1,
        userStatus: "participating"
      } : null);
    } catch (error) {
      console.error("Error joining challenge:", error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleSubmitProof = async () => {
    if (!proofFile || !proofDescription.trim()) return;

    setIsSubmittingProof(true);
    try {
      // Upload to IPFS and submit to smart contract
      if (challenge) {
        await web3Service.submitProof(challenge.id.toString(), address!, proofFile, proofDescription);
        
        setChallenge(prev => prev ? {
          ...prev,
          userStatus: "submitted"
        } : null);
        
        setProofFile(null);
        setProofDescription("");
        alert("Proof submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting proof:", error);
    } finally {
      setIsSubmittingProof(false);
    }
  };

  const handleLikeChallenge = async () => {
    if (!challenge) return;
    
    setChallenge(prev => prev ? {
      ...prev,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      isLiked: !prev.isLiked
    } : null);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !isConnected) return;

    const comment: Comment = {
      id: comments.length + 1,
      author: address!,
      content: newComment,
      timestamp: Date.now(),
      likes: 0,
      isLiked: false,
    };

    setComments(prev => [comment, ...prev]);
    setNewComment("");
  };

  const formatTimeLeft = (deadline: number) => {
    const now = Date.now();
    const timeLeft = deadline - now;
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days, ${hours} hours left`;
    if (hours > 0) return `${hours} hours left`;
    return "Ending soon";
  };

  const getChallengeTypeColor = (type: string) => {
    switch (type) {
      case "community":
        return "bg-blue-100 text-blue-800";
      case "custom":
        return "bg-purple-100 text-purple-800";
      case "community_service":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {challenge.title}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getChallengeTypeColor(challenge.challengeType)}`}>
                  {challenge.challengeType.replace("_", " ")}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  challenge.status === "active" 
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {challenge.status}
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                Created by {challenge.creatorEns || `${challenge.creator.slice(0, 6)}...${challenge.creator.slice(-4)}`}
              </p>
              <p className="text-lg text-gray-700 mb-6">
                {challenge.description}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <ClockIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-lg font-semibold">{formatTimeLeft(challenge.deadline)}</div>
              <div className="text-sm text-gray-600">Time Remaining</div>
            </div>
            <div className="text-center">
              <UserGroupIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-lg font-semibold">{challenge.currentParticipants}/{challenge.maxParticipants}</div>
              <div className="text-sm text-gray-600">Participants</div>
            </div>
            <div className="text-center">
              <CurrencyDollarIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-lg font-semibold">{challenge.stakeAmount} ETH</div>
              <div className="text-sm text-gray-600">Stake Required</div>
            </div>
            <div className="text-center">
              <DocumentTextIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-lg font-semibold">Daily</div>
              <div className="text-sm text-gray-600">Proof Required</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLikeChallenge}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                {challenge.isLiked ? (
                  <HeartSolidIcon className="w-6 h-6 text-red-600" />
                ) : (
                  <HeartIcon className="w-6 h-6" />
                )}
                <span>{challenge.likes}</span>
              </button>
              <div className="flex items-center gap-2 text-gray-600">
                <ChatBubbleLeftIcon className="w-6 h-6" />
                <span>{challenge.comments}</span>
              </div>
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                <ShareIcon className="w-6 h-6" />
                <span>Share</span>
              </button>
            </div>

            {isConnected && challenge.userStatus === "not_joined" && challenge.status === "active" && (
              <button
                onClick={handleJoinChallenge}
                disabled={isJoining || challenge.currentParticipants >= challenge.maxParticipants}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isJoining ? "Joining..." : "Join Challenge"}
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {["details", "participants", "comments", "submit_proof"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "details" && (
              <div className="space-y-8">
                {/* Proof Requirements */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Proof Requirements</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{challenge.proofRequired}</p>
                  </div>
                </div>

                {/* Rules */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Challenge Rules</h3>
                  <ul className="space-y-2">
                    {challenge.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rewards */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Rewards</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Winners</h4>
                      <p className="text-green-700">{challenge.rewards.winner}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Participants</h4>
                      <p className="text-blue-700">{challenge.rewards.participant}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "participants" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Participants ({participants.length})</h3>
                <div className="space-y-4">
                  {participants.map((participant, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {(participant.ensName || participant.address).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">
                            {participant.ensName || `${participant.address.slice(0, 6)}...${participant.address.slice(-4)}`}
                          </div>
                          <div className="text-sm text-gray-600">
                            Joined {new Date(participant.joinedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          participant.proofSubmitted
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {participant.proofSubmitted ? (
                            <>
                              <CheckCircleIcon className="w-3 h-3" />
                              Proof Submitted
                            </>
                          ) : (
                            "No Proof Yet"
                          )}
                        </div>
                        {participant.proofSubmitted && (
                          <div className={`text-sm font-medium ${getStatusColor(participant.proofStatus)}`}>
                            {participant.proofStatus.charAt(0).toUpperCase() + participant.proofStatus.slice(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "comments" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Comments ({comments.length})</h3>
                
                {/* Add Comment */}
                {isConnected && (
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-semibold">
                              {(comment.authorEns || comment.author).charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium">
                            {comment.authorEns || `${comment.author.slice(0, 6)}...${comment.author.slice(-4)}`}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <button className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors">
                          <HeartIcon className="w-4 h-4" />
                          <span className="text-sm">{comment.likes}</span>
                        </button>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "submit_proof" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Submit Proof</h3>
                
                {challenge.userStatus === "participating" ? (
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Proof Requirements</h4>
                      <p className="text-blue-700">{challenge.proofRequired}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Proof File
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <input
                          type="file"
                          onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                          accept="image/*,.pdf"
                          className="hidden"
                          id="proof-upload"
                        />
                        <label
                          htmlFor="proof-upload"
                          className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Click to upload file
                        </label>
                        <p className="text-gray-500 text-sm mt-1">
                          PNG, JPG, PDF up to 10MB
                        </p>
                        {proofFile && (
                          <p className="text-green-600 text-sm mt-2">
                            Selected: {proofFile.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={proofDescription}
                        onChange={(e) => setProofDescription(e.target.value)}
                        rows={4}
                        placeholder="Describe your proof submission..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <button
                      onClick={handleSubmitProof}
                      disabled={!proofFile || !proofDescription.trim() || isSubmittingProof}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingProof ? "Submitting..." : "Submit Proof"}
                    </button>
                  </div>
                ) : challenge.userStatus === "submitted" ? (
                  <div className="text-center py-8">
                    <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      Proof Submitted
                    </h4>
                    <p className="text-gray-600">
                      Your proof is being reviewed by verifiers
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <XCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      Join Challenge to Submit Proof
                    </h4>
                    <p className="text-gray-600">
                      You need to join this challenge first
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetailPage;
