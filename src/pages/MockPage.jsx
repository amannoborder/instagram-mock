import PhoneMock from '../components/PhoneMock.jsx'

// The phone mock on its own page (the clean deliverable view).
// The controls editor lives at /controls — open it directly by URL.
export default function MockPage() {
  return (
    <div className="page page-mock">
      <PhoneMock />
    </div>
  )
}
