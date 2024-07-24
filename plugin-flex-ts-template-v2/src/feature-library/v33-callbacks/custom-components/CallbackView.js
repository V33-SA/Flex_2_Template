
import React, { Component} from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FormControl from '@material-ui/core/FormControl';

import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import CallbackComponent from './CallbackComponent';
import './callbackstyle.css';
import * as signalR from '@microsoft/signalr'
import Button from '@material-ui/core/Button';

import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';



export default class CallbackView extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
      Callbacks:[],
      Isloading:false,
      Error : '',
      Token : '',
      Login :'',
      Password : '',
      showPassword:false,
      EnableBtn : false,
      LoginError : false,
      SignalrConnexion : null
    }
   

  }

  
  

  componentDidMount() { 
    // to do : au montage, on checke le localstorage et on récupère la date du dernier token et le token si le token n'est pas expiré on setState lez token
    // struture localstorage : FlexToken FlexTokenDate
    
    let Now = Date.now();
    if(localStorage.hasOwnProperty('FlexCallbacksLogin')&&localStorage.hasOwnProperty('FlexCallbackPassword')){
        if(localStorage.hasOwnProperty('FlexTokenDate')&&localStorage.hasOwnProperty('FlexToken')){
      
            if(Now<parseInt(localStorage.getItem('FlexTokenDate'))+86400000){
                
                // Le token a moins d'1 jour on le garde
                this.setState({Token : localStorage.getItem('FlexToken')})
              
            }else{
              this.setState({
                  Login: localStorage.getItem('FlexCallbacksLogin'),
                  Password: atob(localStorage.getItem('FlexCallbackPassword'))
                })
            }
        }
   }
  }

   componentDidUpdate(prevProps, prevState) { 
    const {Login, Password, EnableBtn}= this.state;
    const validEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   
    if(EnableBtn===false && validEmail.test(Login) && Password.length>0){
      this.setState({
        EnableBtn:true
      }) 
    } else if(EnableBtn===true && (!validEmail.test(Login)||Password.length===0)){
      this.setState({
        EnableBtn:false
      }) 
    }
  


    if(prevState.Token!=this.state.Token){
      // to do on load le SignalR car on a un token d'auth
      const connection = new signalR.HubConnectionBuilder().withUrl('https://dev.v33.com/callbackHub',{ accessTokenFactory: ()=> this.state.Token }).build();
      this.setState({SignalrConnexion:connection})
      
      connection.start().then(
        ()=>{
        
          connection.invoke("getWaitingCallback").catch((e)=>{
            this.setState({Error: e.message})
          })
  
          connection.on("getWaitingCallback",(response)=>{ 
            let data=JSON.parse(response)
            this.setState({Callbacks:data})
            this.setState ({Isloading:true})
              
        })
      }).catch((e)=>{
        
        this.setState({Error: e.message})})

    }
   } 

  

   componentWillUnmount() {
    this.state.SignalrConnexion.stop();
    }

    acceptCallback(TaskSid){
     this.state.SignalrConnexion.invoke("sendStatusCallback",TaskSid,"COMPLETED")
    }

    SearchandPopSf(phoneNumber){
      //Invokes API method
      if (window.sforce) {
      sforce.opencti.searchAndScreenPop({ 
          searchParams : phoneNumber,
          callType : sforce.opencti.CALL_TYPE.INBOUND,  
          callback: this.callbackfs
         });
        }  

    }

    callbackfs = (response) => {
      if (response.success) {
         console.log('API method call executed successfully! returnValue:', response.returnValue);
      } else { 
         console.error('Something went wrong! Errors:', response.errors);
      }
     };



    handleChange = e => {
      const name = e.target.name
      this.setState({[name] : e.target.value})
      
    }


    handleClickShowPassword = () => {
      this.setState(state => ({ showPassword: !state.showPassword }));
    };

    submitForm = e =>{
      e.preventDefault();
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({
            username:this.state.Login,
            password:this.state.Password
        });
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      fetch("https://dev.v33.com/api/UserApi/api/token", requestOptions)
        .then(response => {
          if(!response.ok) throw new Error(response.status);
          else return response.text();
          })    
        .then(result => {
            this.setState({Token:result})
            this.setState({LoginError:false})
            localStorage.setItem('FlexToken',result)
            localStorage.setItem('FlexTokenDate', Date.now())
            localStorage.setItem('FlexCallbacksLogin',this.state.Login)
            localStorage.setItem('FlexCallbackPassword', btoa(this.state.Password))
          })
        .catch(error => {
          
          this.setState({LoginError:true})
        });

    }

renderCallabck(callbacks){
  console.log("CB")
  console.log(this.props.worker);
  return callbacks.map((row)=>{
    let formatedDate= new Date(row.CreationDate)
    return(
      <TableRow key={row.TaskSid}>
      <TableCell className='cellule' component="th" scope="row">
        {formatedDate.toLocaleString('fr-FR')}
      </TableCell>
      <TableCell className='cellule' align="right">{row.Callline}</TableCell>
      <TableCell 
          className='cellule' 
          align="right"
          onClick={()=>this.SearchandPopSf(row.From)}
          >{row.From}</TableCell>
      <TableCell className='cellule' align="right">
        <CallbackComponent 
          to={row.From} 
          from={row.To}
          callline={row.Callligne} 
          task={row.TaskSid}
          acceptCallback={(e)=>this.acceptCallback(e)}
          availableWorker={this.props.worker.activity.available}
          >
        </CallbackComponent> 
        
      </TableCell>
      
    </TableRow>
    )

})

}

  render() {
         
    return (
      <>
    
      {this.state.Token!='' &&
                <div  className="CallbackLayout">
              
              <h1 style={{
                  fontSize:"1rem",
                  textAlign:"center"
                }}>Liste des Callbacks à Traiter</h1>
              
              {(this.state.Isloading && this.state.Callbacks.length>0)&&
                
                
                
                <Paper className='tableau'>
                <Table>
                  <TableHead >
                    <TableRow className='entete'> 
                      <TableCell>Date / Heure</TableCell>
                      <TableCell align="right">Ligne</TableCell>
                      <TableCell align="right">Client</TableCell>
                      <TableCell align="right">Action</TableCell>
                      
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {this.renderCallabck(this.state.Callbacks)}
                  </TableBody>
                </Table>
              </Paper>
            
            }
            {(this.state.Isloading && this.state.Callbacks.length==0) &&
            <Paper className='Callbacknodata success'>
              <p className='NodataText'>Pas de Callbacks</p>
            </Paper>
            
            }
            {(!this.state.Isloading && this.state.Error=='')&&
            <Paper className='tableau'>
              <LinearProgress/>
            </Paper>
            }
            {(!this.state.Isloading && this.state.Error!='')&&
            <Paper className='Callbacknodata error'>
            <p className='NodataText'>{this.state.Error}</p>
          </Paper>
            }
              
              </div>
        }
        {
          this.state.Token=='' &&
          <Paper className='LoginFormulaire'>
          
            <FormControl>
              <FormLabel
                  style={{
                    margin:"20px auto",
                    fontSize:"1rem"
                  }}
              >Connexion au Serveur Callbacks</FormLabel>
              <TextField
                id="outlined-adornment-login"
                className='inputunderline'
                name='Login'
                type='email'
                label="Compte(e-mail Salesforce)"
                value={this.state.Login}
                onChange={this.handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
            />
            <TextField
                id="outlined-adornment-password"
                className='inputunderline'
                name='Password'
                type={this.state.showPassword ? 'text' : 'password'}
                label="Mot de Passe"
                value={this.state.Password}
                onChange={this.handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPassword}
                      >
                        {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
            />
            </FormControl>
            
            {this.state.LoginError===true && <p>Erreur de connexion</p>}
          
           
            <Button
              className='SubmitButton'
              variant="contained" 
              color="primary" 
              size="medium"
              onClick={this.submitForm}
              disabled={!this.state.EnableBtn}
            >
              Se connecter
            </Button>
          </Paper>
        }
  
      
  </>
    )      
  }
}


