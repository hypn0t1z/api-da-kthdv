#convertBase64: function(event){
    try{
        var f = event.target.files[0];
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                let binaryData = e.target.result;
                let base64String = window.btoa(binaryData);
                this.$http.post('/image/upload', base64String);
            }.bind(this);
        }.bind(this))(f);
        reader.readAsBinaryString(f);              
    }catch(err){
        this.$http.post('/image/upload', '');
    } 
}, 