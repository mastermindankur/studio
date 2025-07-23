
import { WillFormData } from "@/context/WillFormContext";
import { format } from 'date-fns';

interface WillDocumentProps {
  formData: WillFormData;
  id?: string;
}

export function WillDocument({ formData, id = "will-document-render" }: WillDocumentProps) {
  const {
    personalInfo,
    familyDetails,
    assets,
    beneficiaries,
    assetAllocation,
    executor,
  } = formData;

  const getAssetName = (assetId: string) => {
    const asset = assets?.assets?.find((a: any) => a.id === assetId);
    return asset ? (asset.details.description || 'Unknown Asset') : 'Unknown Asset';
  };
  
  const getBeneficiaryName = (beneficiaryId: string) => {
    // First check in explicit beneficiaries
    const beneficiary = beneficiaries?.beneficiaries?.find((b: any) => b.id === beneficiaryId);
    if (beneficiary) return beneficiary.name;
  
    // Then check in family details (spouse)
    const spouseId = `spouse-${familyDetails?.spouseName?.replace(/\s+/g, '-').toLowerCase()}`;
    if (beneficiaryId === spouseId) return `${familyDetails.spouseName} (Spouse)`;
  
    // Then check in family details (children)
    const child = familyDetails?.children?.find((c: any) => {
      const childId = `child-${c.name?.replace(/\s+/g, '-').toLowerCase()}`;
      return beneficiaryId === childId;
    });
    if (child) return `${child.name} (Child)`;
  
    return 'Unknown Beneficiary';
  };

  const today = new Date();

  // Safely handle date of birth from different sources (Date object, string, or Firestore timestamp)
  const getAge = () => {
    if (!personalInfo?.dob) return 'N/A';
    try {
      // Check if dob is a Firestore Timestamp-like object
      if (typeof personalInfo.dob === 'object' && personalInfo.dob !== null && 'toDate' in personalInfo.dob && typeof personalInfo.dob.toDate === 'function') {
        const dobDate = personalInfo.dob.toDate();
        return today.getFullYear() - dobDate.getFullYear();
      }
      // Handle Date objects or valid date strings
      const dobDate = new Date(personalInfo.dob);
      if (isNaN(dobDate.getTime())) return 'N/A'; // Invalid date
      return today.getFullYear() - dobDate.getFullYear();
    } catch (e) {
      return 'N/A';
    }
  };
  const age = getAge();


  const placeOfSigning = executor?.city && executor?.state ? `${executor.city}, ${executor.state}` : '[City, State]';

  return (
    <div id={id} className="p-12 bg-white text-black font-serif">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold uppercase tracking-widest">Last Will and Testament</h1>
        <p className="text-xl font-bold uppercase tracking-wider mt-2">of</p>
        <h2 className="text-3xl font-bold uppercase tracking-widest mt-2">{personalInfo?.fullName || '[Testator Name]'}</h2>
      </div>

      <p className="mb-6 text-lg leading-relaxed">
        I, <strong>{personalInfo?.fullName}</strong>, son/daughter/wife of <strong>{personalInfo?.fatherHusbandName}</strong>, aged about <strong>{age}</strong> years, residing at <strong>{personalInfo?.address}</strong>, being of sound mind and memory, do hereby make, publish and declare this to be my Last Will and Testament, revoking all former wills and codicils heretofore made by me.
      </p>

      <h3 className="text-xl font-bold border-b-2 border-black pb-2 mb-4 mt-8">I. Declaration</h3>
      <p className="mb-6 text-lg leading-relaxed">
        I declare that I am making this Will voluntarily and without any coercion or undue influence. I am of legal age to make a will and am fully aware of the nature and extent of my property and the disposition I am making thereof.
      </p>

      {executor && (
        <>
          <h3 className="text-xl font-bold border-b-2 border-black pb-2 mb-4 mt-8">II. Appointment of Executor</h3>
          <p className="mb-4 text-lg leading-relaxed">
            I hereby appoint <strong>{executor.primaryExecutor.fullName}</strong>, residing at <strong>{executor.primaryExecutor.address}</strong>, as the sole Executor of this Will.
          </p>
          {executor.addSecondExecutor && executor.secondExecutor && executor.secondExecutor.fullName && (
            <p className="mb-6 text-lg leading-relaxed">
              In the event that my primary Executor is unable or unwilling to serve, I appoint <strong>{executor.secondExecutor.fullName}</strong>, residing at <strong>{executor.secondExecutor.address}</strong>, as the alternate Executor.
            </p>
          )}
        </>
      )}

      {assets && beneficiaries && assetAllocation && (
         <>
            <h3 className="text-xl font-bold border-b-2 border-black pb-2 mb-4 mt-8">III. Disposition of Property</h3>
            <p className="mb-4 text-lg leading-relaxed">
                I direct my Executor to distribute my assets as follows:
            </p>
            <table className="w-full border-collapse border border-black text-lg">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-black p-2">Asset Description</th>
                        <th className="border border-black p-2">Beneficiary</th>
                        <th className="border border-black p-2">Share</th>
                    </tr>
                </thead>
                <tbody>
                    {assetAllocation.allocations.map((alloc: any, index: number) => (
                        <tr key={index}>
                            <td className="border border-black p-2">{getAssetName(alloc.assetId)}</td>
                            <td className="border border-black p-2">{getBeneficiaryName(alloc.beneficiaryId)}</td>
                            <td className="border border-black p-2 text-center">{alloc.percentage}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
      )}

      {executor?.specialInstructions && (
          <>
            <h3 className="text-xl font-bold border-b-2 border-black pb-2 mb-4 mt-8">IV. Special Instructions</h3>
            <p className="text-lg leading-relaxed whitespace-pre-wrap">{executor.specialInstructions}</p>
          </>
      )}


      <p className="text-lg leading-relaxed mt-12">
        IN WITNESS WHEREOF, I have hereunto set my hand to this, my Last Will and Testament, at {placeOfSigning} on this {format(today, "do")} day of {format(today, "MMMM, yyyy")}.
      </p>

      <div className="mt-24">
        <div className="w-1/2 border-t-2 border-black pt-2">
            <p className="text-lg">(Signature of Testator)</p>
            <p className="text-lg font-bold">{personalInfo?.fullName}</p>
        </div>
      </div>

      <div className="mt-16 border-t-2 border-dashed border-black pt-8">
        <p className="text-lg leading-relaxed">
          The foregoing instrument was signed, published, and declared by the Testator, <strong>{personalInfo?.fullName}</strong>, as their Last Will and Testament in our presence, who, at their request and in their presence, and in the presence of each other, have hereunto subscribed our names as witnesses.
        </p>
        <div className="flex justify-between mt-16">
            <div className="w-2/5">
                <div className="border-t-2 border-black pt-2">
                    <p className="text-lg">(Signature of Witness 1)</p>
                    <p className="mt-4">Name: ________________________</p>
                    <p className="mt-2">Address: ______________________</p>
                </div>
            </div>
            <div className="w-2/5">
                <div className="border-t-2 border-black pt-2">
                    <p className="text-lg">(Signature of Witness 2)</p>
                    <p className="mt-4">Name: ________________________</p>
                    <p className="mt-2">Address: ______________________</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
