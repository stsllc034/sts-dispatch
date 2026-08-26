import Image from "next/image";

type Props = {
  tripNumber: string;
  status: string;
};

export default function ConfirmationHeader({
  tripNumber,
  status,
}: Props) {
  return (
    <div className="border-b-4 border-blue-900 pb-6 mb-8">

      <div className="flex justify-between items-start">

        <div className="pt-2">

          <p className="text-sm">
            <span className="font-semibold">
              Trip #:
            </span>{" "}
            {tripNumber}
          </p>

          <p className="text-sm mt-1">
            <span className="font-semibold">
              Status:
            </span>{" "}
            <span className="font-bold uppercase">
              {status}
            </span>
          </p>

        </div>

        <Image
          src="/images/sts-logo.png"
          alt="STS Logo"
          width={250}
          height={110}
          priority
        />

      </div>

    </div>
  );
}