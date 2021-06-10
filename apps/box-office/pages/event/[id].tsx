import 'bootstrap/dist/css/bootstrap.css'
import styles from '../../styles/Event.module.css'
import { GetStaticPropsResult } from 'next'
import Link from 'next/link'
import { getEvents, getEventById } from '../../api/activity'

interface Event {
  _id: string
  title: string
  startTime: string
  location: string
  seatSelection: boolean
}

const Event: React.FC<Event> = (props) => {

  const loadCheckoutIframe = () => {
    let host = props.seatSelection ?
      'https://checkout.happin.app/checkoutNew/reservedSeating/' : 'https://checkout.happin.app/checkoutNew/ticket/'

    if (process.browser) {
      const iframeElement = document.createElement('iframe');
      iframeElement.id = 'checkout-iframe';
    }

    return host + props._id
  };

  return (
      <div className="container">
        <div className="row">
          <div className={styles.card}>
            <h2>{props.title}</h2>
            <p>{props.location}</p>
          </div>
        </div>
        <div className="row">
            <Link href={`${loadCheckoutIframe()}`}>
              <button type="button" className="btn btn-primary">
                Sell
              </button>
            </Link>
        </div>
      </div>   
  )
}

export async function getStaticProps(context: { params: { id: string } }): Promise<GetStaticPropsResult<Event>> {
  const res = await getEventById(context.params.id);
  const props = res.data

  return {
    props
  }
}

export async function getStaticPaths() {
  const res = await getEvents();

  const paths = res.data.activities.map((e: any) => ({
      params: {id: e._id},
  }));

  return {paths, fallback: false}
}

export default Event