import needle from 'needle';

// needle.post('http://localhost:3000/save-user', {
//     fname: "Mary Jane",
//     mname: "",
//     lname: "Watson",
//     utype: "User",
//     email: "mjwatson@gmail.com",
//     password: "maryjane"
// }, (err, res) => {
//     console.log(res.body);
// });

// needle.post('http://localhost:3000/save-product', {
//     pid: "21346547",
//     pname: "shrimp 1 kl",
//     pdesc: "fresh",
//     ptype: 4,
//     pqty: 15,
// }, (err, res) => {
//     console.log(res.body);
// });

// needle.post('http://localhost:3000/save-order-transaction', {
//     tid: "09657435",
//     pid: "21346547",
//     oqty: 3,
//     ostatus: 2,
//     email: "mjwatson@gmail.com",
//     date: "2024-05-05T20:34:52.000+00:00",
//     time: "8:00PM"
// }, (err, res) => {
//     console.log(res.body);
// });

// needle.post('http://localhost:3000/update-productqty',{
//     pid: "21346547",
//     pqty: 10
// }, (err,res) => {
//     console.log(res.body);
// });

// needle.post('http://localhost:3000/update-cart',{
//     cid: "663cd823d411ea96766d0ab7",
//     itemid: "21346547",
//     itemqty: 5,
// }, (err,res) => {
//     console.log(res.body);
// });

// needle.post('http://localhost:3000/update-user', {
//     fname: "Mary Jane",
//     mname: "",
//     lname: "Parker",
//     utype: "User",
//     email: "mjwatson@gmail.com",
//     password: "maryjane"  
// }, (err, res) => {
//     console.log(res.body);
// })

// needle.post('http://localhost:3000/update-ordertransaction',{
//     tid: "09657435",
//     ostatus: 1
// }, (err, res) => {
//     console.log(res.body);
// });

// needle.post('http://localhost:3000/delete-product',{
//     pid: "21346547"
// }, (err, res) => {
//     console.log(res.body);
// });

// needle.post('http://localhost:3000/delete-cartproduct', {
//     cid: "663cd823d411ea96766d0ab7",
//     itemid: "21346547"
// }, (err, res) => {
//     console.log(res.body);
// })

needle.post('http://localhost:3000/delete-user',{
    email: "mjwatson@gmail.com"
}, (err, res) => {
    console.log(res.body);
});


needle.get('http://localhost:3000/users', (err, res) => {
    console.log(res.body);
}); 



needle.get('http://localhost:3000/cart-by-user?id=663c7861bf03ce21c29eadae', (err, res) => {
    console.log(res.body);
});

