import { useEffect, useState } from "react"
import { styled } from '@mui/material/styles'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableContainer from '@mui/material/TableContainer'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Table from '@mui/material/Table'
import Paper from '@mui/material/Paper'
import { Typography } from "@mui/material"
import { User } from "../models/User"
import downloadUsers, { UserListResponse } from "../api/download-user-list"

const UsersComponent = () => {

  const [ userList, setUserList ] = useState<undefined | UserListResponse>()


  useEffect( () => {
    downloadUsers().then( response => {
      console.log( response.data )
      setUserList( response.data )
    } )


  }, [] )

  const createRow = (user:User) => {
    return (<StyledTableRow key={`table-user-row-${user.email}`}>
      <StyledTableCell>
        <Typography fontSize="h30" fontWeight="bold">{user.nickname}</Typography>
      </StyledTableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{JSON.stringify( user.details )}</TableCell>
      <TableCell>{JSON.stringify( user.permissions )}</TableCell>
      <TableCell>{user.created}</TableCell>
      <TableCell>{user.activated ? `TAK` : `NIE`}</TableCell>
    </StyledTableRow>)
  }

  if (!userList) return <div>Ładowanie</div>
    
  return (
    <TableContainer component={Paper}>
      <Table sx={{ marginTop:1 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Nazwa użytkownika</StyledTableCell>
            <StyledTableCell>Rola</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>Szczegóły</StyledTableCell>
            <StyledTableCell>Uprawnienia</StyledTableCell>
            <StyledTableCell>Utworzono</StyledTableCell>
            <StyledTableCell>Aktywny</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            userList.list.map( user => {
              return createRow( user )
            } )
          }
        </TableBody>
      </Table>
    </TableContainer>
  )
}
const StyledTableCell = styled( TableCell )(({ theme }) => ({
  [ `&.${tableCellClasses.head}` ]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 14,
    fontWeight: `bold`,
  },
  [ `&.${tableCellClasses.body}` ]: {
    fontSize: 14,
  },
}) )

const StyledTableRow = styled( TableRow )(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },

  '&:last-child td, &:last-child th': {
    border: 0,
  },
}) )
export default UsersComponent
