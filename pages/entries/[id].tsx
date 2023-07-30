import { ChangeEvent, useState, useMemo, FC, useContext } from "react";
import { GetServerSideProps } from 'next'
import {capitalize, Button, Card, CardActions, CardContent, CardHeader, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, IconButton } from "@mui/material"
import { Layout } from "../../components/layouts"
import  SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Entry, EntryStatus } from "../../interfaces";
import {isValidObjectId} from "mongoose";
import { dbEntries } from "../../database";
import { EntriesContext } from "../../context/entries";
import { dateFunctions } from "../../utils";



const validStatus: EntryStatus[] = ["pending", "in-progress", "finished"]

interface Props {
    entry: Entry
}

 const EntryPage:FC<Props>= ({entry}) => {

    const {updateEntry} = useContext(EntriesContext)

    const [inputValue, setInputValue] = useState(entry.description)
    const [status, setStatus] = useState<EntryStatus>(entry.status)
    const [touched, setTouched] = useState(false)

    
    const isNotValid = useMemo(() => inputValue.length <= 0 && touched, [inputValue, touched])


    const onInputValueChanged = ( event: ChangeEvent<HTMLInputElement> ) => {
        setInputValue( event.target.value );
    }

    const onStatusChanged = ( event: ChangeEvent<HTMLInputElement> ) => {
        setStatus( event.target.value as EntryStatus );
    }

    const onSave = () => {
        if(inputValue.trim().length === 0 ) return;

        const updatedEntry: Entry = {
            ...entry,
            description: inputValue,
            status
        }
        
        updateEntry(updatedEntry, true)

    }


  return (
    
    <Layout title={inputValue.substring(0,20) + "..."}>
        <Grid
        container
        justifyContent={"center"}
        sx={{marginTop: 2}}
        >
            <Grid item xs={12} sm={8} md={6}>
                <Card>
                    <CardHeader
                    title={`Entrada`}
                    subheader={`Creada ${dateFunctions.getFormetDistanceToNow(entry.createdAt)}`}
                    />

                    <CardContent>
                        <TextField 
                        sx={{marginTop: 2, marginBottom: 1}} 
                        fullWidth
                         placeholder="Nueva Entrada" 
                         autoFocus multiline 
                         label="Nueva Entrada" 
                         onChange={onInputValueChanged} 
                         value={inputValue}
                         onBlur={() => setTouched(true)}
                         helperText={isNotValid && "El campo no puede estar vacio"}
                         error={isNotValid}
                         />

                        <FormControl fullWidth sx={{marginTop: 2, marginBottom: 1}}>
                            <FormLabel>Estado: </FormLabel>
                            <RadioGroup row value={status} onChange={onStatusChanged}>
                                {validStatus.map((status) => (
                                    <FormControlLabel key={status} value={status} control={<Radio/>} label={capitalize(status)}/>
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </CardContent>
                    <CardActions>
                        <Button 
                            startIcon={<SaveOutlinedIcon/>}
                            variant="contained"
                            fullWidth
                            onClick={onSave}
                            disabled={inputValue.length <= 0 }
                        >
                            Guardar
                        </Button>
                    </CardActions>

                </Card>
            </Grid>
        </Grid>

        <IconButton sx={{position: "fixed", bottom: "2rem", right: "2rem", backgroundColor: 'error.dark'}}>
            <DeleteOutlineIcon/>
        </IconButton>
    </Layout>
  )
}
export const getServerSideProps:GetServerSideProps = async ({params}) => {
    const {id} = params as {id: string}
    
    const entry = await dbEntries.getEntryById(id)




    if(!entry){
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }



    return {
        props: {
            entry
        }
    }
}

export default EntryPage



