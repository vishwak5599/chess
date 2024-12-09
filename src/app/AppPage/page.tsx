import React, { Suspense } from 'react'
import GamePage from '../GamePage/page'

const AppPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading game...</div>}>
        <GamePage />
      </Suspense>
    </div>
  )
}

export default AppPage
