// "use client";

// import Link from "next/link";
// import { useAccount, useReadContract, useWriteContract } from "wagmi";
// import { abi } from "../utils/abi";
// import { useEffect, useState } from "react";
// import WalletWrapper from "src/components/WalletWrapper";
// import axios from "axios";
// import { useModal } from "src/components/Modalcontext";
// import { useLoader } from "src/components/Loadercontext";
// import { parseContractError } from "../utils/errors";
// import { useRouter } from "next/navigation";
// import { formatEther } from "ethers";

// interface ProfileData {
//     noOfCampaignsFunded: bigint;
//     noOfCampaignsCreated: bigint;
//     totalAmountDonated: bigint;
//     dateCreated: bigint;
//     profileBalance: bigint;
//     profileOwner: `0x${string}`;
//     profileDetailsHash: `0x${string}`;
// }

// interface FormData {
//     user_name: string;
//     bio: string;
// }

// interface UserCampaign {
//     id: bigint;
//     dateCreated?: number;
//     endDate: bigint;
//     projectGoal: bigint;
//     projectAmountRaised: bigint;
//     status: number;
//     isClaimedByAdmin?: boolean;
//     projectDetailsHash: `0x${string}`;
//     creator: `0x${string}`;
//     donors?: any[];
// }

// interface CampaignDetails {
//     _id: string;
//     title: string;
//     [key: string]: any; // This allows for dynamic properties if the structure is unknown
// }

// function Profile() {
//     const account = useAccount();
//     const { setIsShown, setMessage, setIcon } = useModal();
//     const { setIsLoading } = useLoader();
//     const { writeContractAsync } = useWriteContract();
//     const [profile, setProfile] = useState<ProfileData | null>(null);
//     const [formData, setFormData] = useState<FormData>({
//         user_name: "",
//         bio: "",
//     });
//     const [shouldFetchCampaigns, setShouldFetchCampaigns] = useState(false);
//     const [userCampaigns, setuserCampaigns] = useState<UserCampaign[] | []>([]);
//     const router = useRouter();
//     const [userCampaignDetails, setUserCampaignDetails] = useState<{
//         [key: string]: CampaignDetails;
//     }>({});

//     const createProfile = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         const usernamePattern = /^[A-Za-z]+$/;

//         if (
//             !usernamePattern.test(formData.user_name) ||
//             formData.user_name.length < 5 ||
//             formData.user_name.length > 15
//         ) {
//             setMessage(
//                 "Invalid username. Only letters allowed, and must be between 5 and 15 characters.",
//             );
//             setIcon("no");
//             setIsShown(true);

//             return;
//         }

//         setIsLoading(true);

//         try {
//             const response = await axios.post(
//                 `${process.env.NEXT_PUBLIC_DB_URL as string}/profile`,
//                 {
//                     data: {
//                         ...formData,
//                         user_address: account.address,
//                     },
//                 },
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                         CrawdifyServer: process.env
//                             .NEXT_PUBLIC_HEADER_VALUE as string,
//                     },
//                 },
//             );
//             const metadataHash = `0x${response.data.result}`;
//             const result = await writeContractAsync({
//                 abi,
//                 address: `0x${
//                     process.env.NEXT_PUBLIC_CRAWDIFY_ETH_SEPOLIA as string
//                 }`,
//                 account: account.address,
//                 functionName: "createProfile",
//                 args: [`0x${response.data.result}`],
//             });

//             console.log(result);
//             setMessage("Profile successfully created");
//             setIcon("yes");
//             setIsShown(true);
//             setIsLoading(false);
//             await refetch();
//         } catch (error: any) {
//             setMessage(`ERROR: ${parseContractError(error)}`);
//             setIcon("no");
//             setIsShown(true);

//             setIsLoading(false);
//         }
//     };

//     const handleChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//     ) => {
//         const { name, value } = e.target;

//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//     };

//     const {
//         data: profileData,
//         isError,
//         isLoading,
//         refetch,
//     } = useReadContract({
//         abi,
//         address: `0x${process.env.NEXT_PUBLIC_CRAWDIFY_ETH_SEPOLIA as string}`,
//         functionName: "getProfile",
//         account: account.address,
//     });

//     const { data: campaignsQuery, refetch: refetchCampaigns } = useReadContract(
//         {
//             abi,
//             address: `0x${process.env.NEXT_PUBLIC_CRAWDIFY_ETH_SEPOLIA as string}`,
//             functionName: "getCampaigns",
//             account: account.address,
//             args: shouldFetchCampaigns
//                 ? [`0x${String(account.address).substring(2)}`]
//                 : undefined,
//         },
//     );

//     useEffect(() => {
//         console.log(campaignsQuery);
//         const userSortedCampaigns =
//             campaignsQuery?.map((campaign) => ({
//                 creator: campaign.creator,
//                 dateCreated: Number(campaign.dateCreated),
//                 projectAmountRaised: campaign.projectAmountRaised,
//                 projectGoal: campaign.projectGoal,
//                 status: campaign.status,
//                 id: campaign.id,
//                 projectDetailsHash: campaign.projectDetailsHash,
//                 endDate: campaign.endDate,
//             })) ?? [];

//         setuserCampaigns(
//             userSortedCampaigns.length > 0 ? userSortedCampaigns : [],
//         );
//     }, [campaignsQuery]);

//     useEffect(() => {
//         if (account.isConnected && account.address) {
//             refetch();
//         }
//     }, [account.isConnected, account.address, refetch]);

//     useEffect(() => {
//         if (profileData) {
//             console.log(profileData);
//             refetchCampaigns();
//             setProfile(profileData as ProfileData);
//             setShouldFetchCampaigns(true);
//         }
//     }, [profileData]);

//     const navigateToNextPage = (creatorAddress: any, id: bigint) => {
//         router.push(`/explore/${creatorAddress}${Number(id)}`);
//     };

//     useEffect(() => {
//         if (userCampaigns && userCampaigns.length > 0) {
//             const getCampaignDetailsFromDB = async (id: string) => {
//                 console.log(id);
//                 const campaign = await axios.get(
//                     `${process.env.NEXT_PUBLIC_DB_URL as string}/store`,
//                     {
//                         params: {
//                             data: {
//                                 id: id.substring(2),
//                             },
//                         },
//                         headers: {
//                             "Content-Type": "application/json",
//                             CrawdifyServer: process.env
//                                 .NEXT_PUBLIC_HEADER_VALUE as string,
//                         },
//                     },
//                 );
//                 return campaign.data.campaigns[0];
//             };

//             const fetchCampaignDetails = async () => {
//                 const details: { [key: string]: CampaignDetails } = {};

//                 await Promise.all(
//                     userCampaigns.map(async (campaign) => {
//                         try {
//                             const campaignsFromDB =
//                                 await getCampaignDetailsFromDB(
//                                     campaign.projectDetailsHash,
//                                 );
//                             details[campaignsFromDB._id] = campaignsFromDB;
//                         } catch (error) {
//                             console.error(
//                                 `Error fetching campaign with ID: ${campaign.projectDetailsHash}`,
//                                 error,
//                             );
//                         }
//                     }),
//                 );

//                 setUserCampaignDetails(details);
//                 console.log(details);
//             };

//             fetchCampaignDetails();
//         }
//     }, [userCampaigns]);

//     const withdrawFundsFromCampaign = async () => {
//         try {
//             setIsLoading(true);
//             const result = await writeContractAsync({
//                 abi,
//                 address: `0x${
//                     process.env.NEXT_PUBLIC_CRAWDIFY_ETH_SEPOLIA as string
//                 }`,
//                 account: account.address,
//                 functionName: "withdrawFunds",
//                 args: [],
//             });

//             if (result) {
//                 setMessage(`Balance successfully withdrawn, check wallet`);
//                 setIcon("yes");
//                 setIsShown(true);
//                 setIsLoading(false);
//             }
//         } catch (error) {
//             setMessage(`ERROR: ${parseContractError(error)}`);
//             setIcon("no");
//             setIsShown(true);
//             setIsLoading(false);
//         }
//     };

//     return (
//         <>
//             {account.isConnected ? (
//                 profile ? (
//                     Number(profile.dateCreated) > 0 ? (
//                         <section className="flex flex-row justify-start items-start w-full mx-auto px-6 pt-8 space-x-4">
//                             <section className="flex flex-col h-[24rem] justify-start py-4 space-y-4 items-center rounded-lg glass-background w-1/3">
//                                 <p className="font-medium">Your Balance</p>
//                                 <p className="flex flex-col justify-center items-center w-full space-y-2">
//                                     <span className="font-bold text-lg">
//                                         {profile
//                                             ? Number(profile.profileBalance) /
//                                               1e18
//                                             : "0.00"}{" "}
//                                         ETH
//                                     </span>
//                                     <button
//                                         onClick={() => {
//                                             withdrawFundsFromCampaign();
//                                         }}
//                                         className="rounded-lg flex justify-center items-center px-5 py-2 font-bold custom-gradient"
//                                     >
//                                         Withdraw
//                                     </button>
//                                 </p>
//                             </section>
//                             <section className="flex flex-col min-h-[24rem] justify-start space-y-3 px-4 items-center rounded-lg glass-background w-2/3 py-4">
//                                 <section className="flex justify-start w-full">
//                                     <section className="flex flex-col justify-start items-center self-start w-full">
//                                         <p className="font-bold text-lg text-left self-start">
//                                             All your Campaigns
//                                         </p>
//                                         <p className="text-sm text-left self-start">
//                                             Monitor your campaign's progress
//                                             here.
//                                         </p>
//                                     </section>
//                                     <Link
//                                         href={"/create"}
//                                         className="rounded-lg flex justify-center items-center px-5 py-2 text-nowrap font-bold custom-gradient"
//                                     >
//                                         Create new campaign
//                                     </Link>
//                                 </section>
//                                 <section className="flex flex-col justify-center items-center space-y-5">
//                                     {profile &&
//                                     Number(profile.noOfCampaignsCreated) > 0 ? (
//                                         <>
//                                             <p>
//                                                 You have created{" "}
//                                                 {profile.noOfCampaignsCreated.toString()}{" "}
//                                                 campaign(s)
//                                             </p>
//                                             <section className="grid grid-cols-3 gap-4">
//                                                 {userCampaigns.map(
//                                                     (campaign) => (
//                                                         <section
//                                                             onClick={() =>
//                                                                 navigateToNextPage(
//                                                                     campaign.creator,
//                                                                     campaign.id,
//                                                                 )
//                                                             }
//                                                             className="flex flex-col rounded-lg justify-start cursor-pointer space-y-3 max-w-96 items-start mx-auto p-3 glass-background hover:opacity-90"
//                                                             key={campaign.id}
//                                                         >
//                                                             <img
//                                                                 src={`./static/${Math.floor(Math.random() * 6) + 1}.jpeg`}
//                                                                 alt=""
//                                                                 className="w-full"
//                                                             />

//                                                             {account.isConnected ? (
//                                                                 <>
//                                                                     <p className="font-bold">
//                                                                         {Object.keys(
//                                                                             userCampaignDetails,
//                                                                         )
//                                                                             .length >
//                                                                         0
//                                                                             ? userCampaignDetails[
//                                                                                   String(
//                                                                                       campaign.projectDetailsHash,
//                                                                                   ).substring(
//                                                                                       2,
//                                                                                   )
//                                                                               ]
//                                                                                 ? userCampaignDetails[
//                                                                                       String(
//                                                                                           campaign.projectDetailsHash,
//                                                                                       ).substring(
//                                                                                           2,
//                                                                                       )
//                                                                                   ]
//                                                                                       .title
//                                                                                 : "Campaign details not found."
//                                                                             : "No campaign details loaded."}
//                                                                     </p>
//                                                                     <div className="w-full bg-[#023430] rounded-full h-[0.35rem]">
//                                                                         <div
//                                                                             className="bg-[#bce26b] h-full rounded-full"
//                                                                             style={{
//                                                                                 width: `${(Number(formatEther(campaign.projectAmountRaised)) / Number(formatEther(campaign.projectGoal))) * 100}%`,
//                                                                             }}
//                                                                         ></div>
//                                                                     </div>
//                                                                     <p className="font-bold text-left">
//                                                                         {formatEther(
//                                                                             campaign.projectAmountRaised,
//                                                                         )}{" "}
//                                                                         ETH
//                                                                         raised
//                                                                         of{" "}
//                                                                         {formatEther(
//                                                                             campaign.projectGoal,
//                                                                         )}{" "}
//                                                                         ETH
//                                                                     </p>
//                                                                 </>
//                                                             ) : (
//                                                                 <div>
//                                                                     <p className="text-lg font-bold">
//                                                                         Connect
//                                                                         Wallet
//                                                                     </p>
//                                                                 </div>
//                                                             )}
//                                                         </section>
//                                                     ),
//                                                 )}
//                                             </section>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <img
//                                                 src="./img/search-image.png"
//                                                 alt=""
//                                                 className="w-[12rem]"
//                                             />
//                                             <p className="text-center text-xs">
//                                                 You have not created a campaign
//                                             </p>
//                                         </>
//                                     )}
//                                 </section>
//                             </section>
//                         </section>
//                     ) : (
//                         <section className="flex flex-row justify-start items-start w-full mx-auto rounded-lg px-4 py-4 space-x-4 glass-background">
//                             <form
//                                 onSubmit={createProfile}
//                                 className="flex flex-col space-y-2 w-1/2 h-full justify-start rounded-lg items-start"
//                             >
//                                 <p className="relative w-full">
//                                     <span className="text-xs absolute z-10 left-4 bg-transparent top-1 shadow-none text-white text-opacity-50">
//                                         Your Name
//                                     </span>
//                                     <input
//                                         type="text"
//                                         placeholder="Crawdify"
//                                         className="px-4 py-6 pb-3 outline-none border-none rounded-lg glass-background w-full"
//                                         value={formData.user_name}
//                                         onChange={handleChange}
//                                         name="user_name"
//                                         minLength={5}
//                                         maxLength={15}
//                                         required
//                                         autoComplete="off"
//                                     />
//                                 </p>
//                                 <p className="relative w-full">
//                                     <span className="text-xs absolute z-10 left-4 bg-transparent top-1 shadow-none text-white text-opacity-50">
//                                         Bio
//                                     </span>

//                                     <textarea
//                                         name="bio"
//                                         rows={6} // Set default rows, but we'll control the height with CSS
//                                         className="w-full flex-grow glass-background appearance-none resize-none outline-none border-none rounded-lg px-4 py-6 pb-3 max-h-96 overflow-hidden custom-textarea"
//                                         placeholder="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsam, eveniet!..."
//                                         style={{
//                                             overflowY: "hidden", // Hides the scrollbar
//                                             resize: "none", // Prevents resizing by user
//                                         }}
//                                         value={formData.bio}
//                                         onChange={handleChange}
//                                         minLength={15}
//                                         maxLength={80}
//                                         required
//                                     ></textarea>
//                                 </p>
//                                 <button
//                                     type="submit"
//                                     className="rounded-lg px-5 py-3 font-bold custom-gradient"
//                                 >
//                                     Create Profile
//                                 </button>
//                             </form>
//                             <section className="flex flex-col space-y-4 w-1/2 h-full justify-center rounded-lg items-center p-4">
//                                 <p className="text-lg font-bold pt-10">
//                                     You don't have a profile yet
//                                 </p>
//                             </section>
//                         </section>
//                     )
//                 ) : (
//                     <div></div>
//                 )
//             ) : (
//                 <section className="flex flex-col justify-center items-center space-y-5 py-16">
//                     <p className="text-lg font-bold">
//                         Please connect your wallet to view your profile
//                     </p>
//                     <WalletWrapper
//                         withWalletAggregator={true}
//                         text="Connect Wallet"
//                         className="rounded-lg !text-white px-5 py-2 font-bold custom-gradient"
//                     ></WalletWrapper>
//                 </section>
//             )}
//         </>
//     );
// }

// export default Profile;
