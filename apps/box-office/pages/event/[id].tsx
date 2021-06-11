import 'bootstrap/dist/css/bootstrap.css'
import styles from '../../styles/Event.module.css'
import { GetStaticPropsResult } from 'next'
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
    const host = props.seatSelection ?
      'https://checkout.happin.app/checkoutNew/reservedSeating/' : 'https://checkout.happin.app/checkoutNew/ticket/'
    
    const url = host+props._id

    if (process.browser) {
      const checkoutIframe = document.createElement('iframe');
      checkoutIframe.id = 'checkout-iframe';
      checkoutIframe.style.cssText = 'position: fixed;' +
        'top: 0;' +
        'left: 0;' +
        'right: 0;' +
        'bottom: 0;' +
        'margin: 0;' +
        'border: 0;' +
        'width: 100%;' +
        'height: 100%;' +
        'z-index: 999;';
      checkoutIframe.src = url;
      document.body.appendChild(checkoutIframe);
    }
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
          <button type="button" className="btn btn-primary" onClick={loadCheckoutIframe}>
            Sell
          </button>
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