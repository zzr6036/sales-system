import { HttpClient } from '@angular/common/http';
import { global } from './global';

export const server = {
    url: global.host,

    //GET Method
    
    //POST Method
    
    //PUT Method
    
    //Using in Boarding Main-Page, Get-Method
    boardingGetUrl: `https://xindotsbackend.azurewebsites.net/_xin/api/merchantinfoes/?token=${localStorage.getItem('Token')}`
}
