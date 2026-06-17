import { StoreProvider } from '../store.jsx'
import PhoneMock from '../components/PhoneMock.jsx'

// The public dummy-IG — its own page, fed by the live manifest (fetch + poll),
// independent of the design mock at "/". This is the URL everyone opens; posts
// uploaded via the endpoint appear here automatically.
export default function LivePage() {
  return (
    <StoreProvider mode="live">
      <div className="page page-mock">
        <PhoneMock />
      </div>
    </StoreProvider>
  )
}
