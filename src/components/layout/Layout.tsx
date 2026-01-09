import { FC, PropsWithChildren } from 'react'
import Body from '~~/components/layout/Body'
import Extra from '~~/components/layout/Extra'
import Footer from '~~/components/layout/Footer'
import Header from '~~/components/layout/Header'

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div 
      className="flex min-h-screen flex-col items-center justify-center gap-6" 
      style={{ 
        background: 'radial-gradient(ellipse at center, #2d2d2d 0%, #1a1a1a 35%, #000000 70%, #000000 100%)'
      }}
    >
      {/* Header removed */}

      <Body>{children}</Body>

      <Footer />
      <Extra />
    </div>
  )
}

export default Layout
