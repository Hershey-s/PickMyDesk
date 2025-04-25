export default function FormError({ errorsMessage, styles }) {
  return <p className={`text-red-500  mt-1 ${styles}`}>{errorsMessage}</p>;
}
