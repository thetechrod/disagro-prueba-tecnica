type DiscountSummaryProps = {
  productDiscount: number;
  serviceDiscount: number;
};

export function DiscountSummary({
  productDiscount,
  serviceDiscount,
}: DiscountSummaryProps) {
  return (
    <div className="discount-summary">
      <div>
        <span>Descuento en productos</span>
        <strong>{productDiscount}%</strong>
      </div>

      <div>
        <span>Descuento en servicios</span>
        <strong>{serviceDiscount}%</strong>
      </div>
    </div>
  );
}
