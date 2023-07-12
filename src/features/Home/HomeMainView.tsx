
import { useContext, useEffect } from 'react'
import { NextRequest, NextResponse } from 'next/server'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Head from 'next/head'
import { NextPage } from 'next'
import { Box, Button } from '@mui/material'
import { Pages } from '../Menu/menu-config'
import { PageContext } from '../AppRootComponent/AppRootViewComponent'
import img from './panda.jpg'

const HomeMainView = () => {

  return (<Box>
    <Image src={img} alt="panda"></Image>
    {/* For variant="text", adjust the height via font-size */}
  </Box>)
}





export default HomeMainView
