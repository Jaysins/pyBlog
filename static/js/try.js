// fetch('http://192.168.137.209:3001/api/data')
// 	.then(res => res.json())
// 	.then(res => console.log(res));

get_try = document.getElementById('try');
console.log(get_try)

$(get_try).click(function(event){
	    req = $.ajax({
        url : '/begin',
        type : 'POST',
        data : {'fullname': 'NWAKAEZE CHUKWUEMEKA JASON', 'course': 'Computer Science', 'duration': '3',
                    'faculty': 'applied science'}                 
    });
})