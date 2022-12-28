const excel = require('exceljs')
const express = require('express')
var path = require('path');
const app = express()
const PORT = 1337

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.listen(process.env.PORT || PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
})

//serve up the index.html file from the server: 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index2.html')
})


app.post('/api', (request, response) => {
  console.log('backend working!')
  const ISCIsAll = request.body.ISCIsAll.flat()
  const TitlesAll = request.body.TitlesAll.map(x => x.join(' ')).flat()

  console.log(ISCIsAll)
  console.log(TitlesAll)

  async function writeToCell() {
    //read the existing workbook 
    const workbook = new excel.Workbook()
    await workbook.xlsx.readFile('estimate-template.xlsx')

    const worksheet = workbook.getWorksheet('Sheet1')

    for (let i = 0; i <= ISCIsAll.length; i++) {
      worksheet.getCell(`B${15+i}`).value = ISCIsAll[i]
    }

    for (let i = 0; i <= TitlesAll.length; i++) {
      worksheet.getCell(`C${15+i}`).value = TitlesAll[i]
    }



   //worksheet.getCell('B15').value = ISCIsAll[0]

    await workbook.xlsx.writeFile('estimate-written.xlsx')
      
    //response.sendFile(__dirname + '/estimate-written.xlsx')

  }

  writeToCell()
  
})


app.get('/newEstimate', (request, response) => {
   response.sendFile(__dirname + '/estimate-written.xlsx')
  })







//this handler is responsible for capturing the data 
// app.post("/addISCI", (req, res) => {
//   const userInput = req.body.ISCI_1; // assume the user input is sent in the request body with a field called "input"
//   console.log(userInput); // log the user input to the console
  
//   async function writeToCell() {
//     //read the existing workbook 
//     const workbook = new excel.Workbook()
//     await workbook.xlsx.readFile('estimate-template.xlsx')

//     const worksheet = workbook.getWorksheet('Sheet1')

//     worksheet.getCell('B15').value = userInput

//     await workbook.xlsx.writeFile('estimate-written.xlsx')
      
//     res.sendFile(__dirname + '/estimate-written.xlsx')

//   }

  
//   writeToCell()
  
// })




//This handler is in charge of serving the client a downloadable file
// app.get('/newEstimate', (request, response) => {
//   response.sendFile(__dirname + '/estimate-written.xlsx')
// })


