class AuthUtil {
    setUsername(username) {
        localStorage.setItem("username", username);
    }

    setName(name) {
        localStorage.setItem("name", name);
    }
    getName() {
        let name = localStorage.getItem("name");
        return name;
    }
    getPhone() {
        let phone = localStorage.getItem("phone");
        return phone;
    }

    setPhone(phone) {
        localStorage.setItem("phone", phone);
    }

    getAuthCurrentDateTime(separatorDate='-', separatorDateTime=' ', separatorTime=':') 
    {
        let currentDateTime = new Date();
        let date = currentDateTime.getDate();
        let month = currentDateTime.getMonth() + 1;
        let year = currentDateTime.getFullYear();
        let hour = currentDateTime.getHours();
        let minute = currentDateTime.getMinutes() + 1;
    //    let second = currentDateTime.getSeconds();
        //return `${year}``${separatorDate}``${month<10?`0${month}`:`${month}`}``${separatorDate}``${date}``${separatorDateTime}``${hour}``${separatorTime}``${minute}``${separatorTime}``${second}`;
        return year + '-' + (month < 10? '0' : '') + month + '-' + date + ' ' + ((hour < 10 || (hour > 12 && hour < 22))? '0' : '') + ((hour > 12) ? (hour - 12): hour) + ':' + ((minute < 10)? '0':'') + minute + ' ' + ((hour > 11) ? 'PM': 'AM');
    }
    getUsername() {
        let username = localStorage.getItem("username");
        return username;
    }

    setTokenDetail(tokenDetail) {
        localStorage.setItem("id_token", tokenDetail.id_token);
        localStorage.setItem("refresh_token", tokenDetail.refresh_token);
        localStorage.setItem("expires_in", tokenDetail.expires_in);
        localStorage.setItem("role_list", JSON.stringify(tokenDetail.roleList));
    }
    setRole(roleList){
        console.log('====roleList====');
        console.log(roleList);
        localStorage.setItem("role_list", JSON.stringify(roleList));
    }
    setMenu(menu) {
        localStorage.setItem("menu", JSON.stringify(menu));
    }

    getIdToken() {
        let id_token = "";
        try {
            id_token = localStorage.getItem("id_token");
            return id_token;

        } catch (e) {
            localStorage.setItem("id_token", "");
            return id_token;
        }
    }

    getRolePresence(roleNames)
    {
        console.log('====getRolePresence(start)====');
        let roleList = "[]";
        let result = "{}";
        try 
        {
            roleList = localStorage.getItem("role_list");
            let roleArray = JSON.parse(roleList);
            for (var j = 0; j < roleNames.length; j++)
            {
                let roleName = roleNames[j];
                console.log('====getRolePresence(role)====');
                console.log(roleName);
                for (var i = 0; i < roleArray.length; i++)
                {
                    let currentRole = roleArray[i];
                    if (currentRole.name === roleName)
                    {
                        console.log('====getRolePresence(true)====');
                        console.log('true');
                        return true;
                    }
                }
            }

            console.log('====getRolePresence(false)====');
            console.log('false');
            return result;
        } 
        catch (e) 
        {
            return result;
        }
    }

    getRoleList() {
        let roleList = "[]";
        try {
            roleList = localStorage.getItem("role_list");
            console.log('====roleList====');
            console.log(roleList);
            return JSON.parse(roleList);

        } catch (e) {
            localStorage.setItem("role_list", "");
            return roleList;
        }
    }

    getRefreshToken() {
        let refresh_token = localStorage.getItem("refresh_token");
        return refresh_token;
    }

    getExpireTime() {
        let expires_in = localStorage.getItem("expires_in");
        return expires_in;
    }

    getMenu() {
        let menu = "";
        try {
            menu = localStorage.getItem("menu");
            return JSON.parse(menu);

        } catch (e) {
            localStorage.setItem("menu", "");
            return menu;
        }
    }
    isTokenValid() {
        let id_token = this.getIdToken();

        if (id_token === null || id_token === undefined) {
            return false;
        }

        return true;
    }

    resetTokenDetail() {
        localStorage.clear();
    }
}

export default new AuthUtil();