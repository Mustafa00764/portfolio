import Border from '@/components/ui/Border'
import poster from '@/assets/images/poster.png'
import '@assets/styles/components/sidebarLeft.css'
import Button from '@/components/ui/Button'

const SidebarLeft = () => {
  return (
    <div className="sidebar-left">
      <Border className="sidebar-poster">
        <img src={poster} alt="" />
      </Border>
      <div className="user-info">
        <p>name</p>
        <h3>Luz Wintheiser</h3>
      </div>
      <div className="user-info">
        <p>occupation</p>
        <h3>web developer</h3>
      </div>
      <div className="user-info">
        <p>corporation</p>
        <h3>CloudFab.com</h3>
      </div>
      <div className="user-info">
        <p>availability</p>
        <Button variant="union" size="large">
          open for hire
        </Button>
      </div>
      <div className="user-info">
        <p>social</p>
        <Button variant="blue" size="xl">
          <span>open connection</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_2405_51)">
              <path
                d="M14.34 12.03L18.683 16.373L13.027 22.029H11.027V15.343L6.66305 19.707L5.24805 18.293L11.027 12.515V11.545L5.24805 5.76499L6.66305 4.35099L11.027 8.71499V2.02899H13.027L18.683 7.68599L14.34 12.03ZM13.027 13.544V19.201L15.855 16.373L13.027 13.544ZM13.027 10.514L15.855 7.68599L13.027 4.85799V10.515V10.514Z"
                fill="currentColor"
              />
            </g>
            <defs>
              <clipPath id="clip0_2405_51">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </Button>
      </div>

      <div className='motto'>
        <p className='motto-title'>Motto:</p>
        <p className='motto-text'>Saepe omnis neque numquam recusandae laudantium.</p>
      </div>
    </div>
  )
}

export default SidebarLeft
