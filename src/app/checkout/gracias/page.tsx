import type { Metadata } from "next";
import { getPaymentReceiptAction } from "@/app/checkout/gracias/actions";
import { PaymentReceiptView } from "@/features/checkout/payment-receipt";

export const metadata: Metadata = { title: "Confirmación de pago" };

export default async function CheckoutGraciasPage({
  searchParams,
}: PageProps<"/checkout/gracias">) {
  const params = await searchParams;
  const reference = typeof params.ref === "string" ? params.ref : "";
  const initial = reference ? await getPaymentReceiptAction(reference) : null;

  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:px-8">
      <PaymentReceiptView initial={initial} reference={reference} />
    </div>
  );
}
