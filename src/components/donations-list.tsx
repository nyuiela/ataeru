// import { BookDonationButton } from "./donation-button";

// interface DonationItem {
//   id: string;
//   title: string;
//   description: string;
//   location: string;
//   requirements: string[];
//   compensation: string;
// }

// const donationData: DonationItem[] = [
//   {
//     id: 'don1',
//     title: 'Standard Donation',
//     description: 'Basic sperm donation with standard screening',
//     location: 'New York Clinic',
//     requirements: [
//       'Age 18-40',
//       'BMI under 30',
//       'Non-smoker'
//     ],
//     compensation: '$150-$200',
//   },
//   {
//     id: 'don2',
//     title: 'Premium Donation',
//     description: 'Extended screening and genetic testing included',
//     location: 'Los Angeles Center',
//     requirements: [
//       'Age 18-35',
//       'College degree',
//       'No family history of genetic disorders'
//     ],
//     compensation: '$300-$450',
//   },
// ];

// export const DonationList = () => {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold">Available Donations</h2>
//       <div className="grid gap-6 md:grid-cols-2">
//         {donationData.map((donation) => (
//           <div key={donation.id} className="border rounded-lg p-6">
//             <h3 className="text-xl font-semibold mb-2">{donation.title}</h3>
//             <p className="text-gray-600 mb-4">{donation.description}</p>
//             <div className="mb-4">
//               <h4 className="font-medium mb-2">Requirements:</h4>
//               <ul className="list-disc pl-5 space-y-1">
//                 {donation.requirements.map((req, i) => (
//                   <li key={i}>{req}</li>
//                 ))}
//               </ul>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="font-medium">{donation.compensation}</span>
//               <BookDonationButton donation={donation} />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };