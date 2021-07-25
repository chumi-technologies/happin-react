import Link from 'next/link';

const EventDescription = () => {
  return (
    <>
      <div className="black-title text-xl sm:text-2xl font-semibold">Description</div>
      <div className="mt-3 sm:mt-5 text-sm sm:text-base">
        NYC legend Skyzoo comes to Berlin Under A to perform an exclusive first
        look at his new album 'All The Brilliant Things' the night before it
        drops!
        <div>
          <Link href="#"><a className="mr-2 link-blue">Website,</a></Link>
          <Link href="#"><a className="mr-2 link-blue">Instagram,</a></Link>
          <Link href="#"><a className="link-blue">Spotify</a></Link>
        </div>
      </div>
    </>
  );
};

export default EventDescription;
