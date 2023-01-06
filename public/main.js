const initApp = () => {
  const droparea = document.querySelector('.droparea');

  const active = () => droparea.classList.add("blue-border");

  const inactive = () => droparea.classList.remove("blue-border");

  const prevents = (e) => e.preventDefault();

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
      droparea.addEventListener(evtName, prevents);
  });

  ['dragenter', 'dragover'].forEach(evtName => {
      droparea.addEventListener(evtName, active);
  });

  ['dragleave', 'drop'].forEach(evtName => {
      droparea.addEventListener(evtName, inactive);
  });

  droparea.addEventListener("drop", handleDrop);

}

document.addEventListener("DOMContentLoaded", initApp);

const handleDrop = (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;
  const fileArray = [...files];
  // console.log(files); // FileList
  // console.log(fileArray)
  nameArray = []

  fileArray.forEach((file) => nameArray.push(file.name.replace(/\s\s+/g, ' ')
  ))

  nameArray.forEach((element, index) => {
    nameArray[index] = element.split('.d')[0]

    })


  //1.0 the following querySelectors pull all the input values and store them as an array. 
  // let one = document.querySelector('#one').value
  // let two = document.querySelector('#two').value
  // let three = document.querySelector('#three').value
  // let four = document.querySelector('#four').value
  // let five = document.querySelector('#five').value
  // let six = document.querySelector('#six').value


  // let array = [one, two, three, four, five, six]

  //1.1 now let's remove any values that are empty: 

  // let arrOfStrings = array.filter((element) => element != '')


  
  //::::::::::::::::\\  //::::::::::::::::\\  //::::::::::::::::\\
  ///STEP TWO: Process the Data
  //::::::::::::::::\\  //::::::::::::::::\\  //::::::::::::::::\\

;
  //2.0 split our array of strings into an array of arrays (word by word), so that we can start to isolate/manipulate individual words 

  let splitTitles = []

 

  for (let i = 0; i < nameArray.length; i++){
     const regex = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]+$/
      splitTitles.push(nameArray[i].split(" ").filter(word => !regex.test(word))) 
     } 

 

     console.log('splitTitles', splitTitles)

  //2.1 now we'll go ahead and remove anything in parentheses from the split titles, we'll then store these values as lengthArr, since they are probably the lengths of the spots: 
  let lengthArr = []

  for (let i = 0; i < splitTitles.length; i++) {
      for (let j = 0; j < splitTitles[i].length; j++) {
       if (splitTitles[i][j].includes('(') === true) {
          lengthArr.push(splitTitles[i][j])
              }
           }
       }



  //2.2 remove any length values in parenthesis from the titles and store as 'clean split array'

  let cleanSplitTitles = splitTitles.map(title => title.filter(length => !lengthArr.includes(length)))
  
  //::::::::::::::::\\  //::::::::::::::::\\  //::::::::::::::::\\
  ///STEP THREE: Separate titles by Single versions vs Open & Full versions
  //::::::::::::::::\\  //::::::::::::::::\\  //::::::::::::::::\\

  //3.0 Now that we have a 2D array of all the script names, we need to separate them into two different arrays:
      let singleTitles = [] //<- titles that contains one ISCI 
      let openClosedTitles = [] //<- titles that contain two ISCIS

  //3.1 we can do this by using a regex match function and the following varaible 'ISCIRegex', which identifies ISCIs by matching four uppercase letters in a row and four digits in a row: 
      let ISCIRegex = /[A-Z]{4}\d{4}/

     for (let i = 0; i < splitTitles.length; i++) {
        if (cleanSplitTitles[i][0].match(ISCIRegex) && cleanSplitTitles[i][1].match(ISCIRegex)) {
           openClosedTitles.push(cleanSplitTitles[i])
       } else {singleTitles.push(cleanSplitTitles[i])}
    
     }   



  //::::::::::::::::\\  //::::::::::::::::\\  //::::::::::::::::\\
  //STEP 4.0: SEPARATE ISCIS FROM TITLES
  //::::::::: :::::::\\  //::::::::::::::::\\  //::::::::::::::::\\

   //4.1 Create singleISCIs array, which contains only the ISCIs from scripts that have **only one** ISCI: 
   let singleISCIs = []
  
   for (let i = 0; i < singleTitles.length; i++) {
       for (let j = 0; j < singleTitles[i].length; j++) {
         if (singleTitles[i][j].match(ISCIRegex)) {
          singleISCIs.push([singleTitles[i][j]])
         }
       }
     }

     
  
   //4.2 Create singleTitlesNoISCIs array. These are all the titles that have only a closed version.

   let singleTitlesNoISCIs = singleTitles.map(title => title.filter(word => !singleISCIs.flat().includes(word)))

   //4.3 Create openClosedISCIs array, which contains all ISCIs from scripts with two ISCIs:
  let openClosedISCIs = []

  console.log('openClosedISCIs' , openClosedISCIs)

  for (let i = 0; i < openClosedTitles.length; i++) {
    let temp = []
      for (let j = 0; j < openClosedTitles[i].length; j++) {
        if (openClosedTitles[i][j].match(ISCIRegex)) {
          openClosedISCIs.push([openClosedTitles[i][j]])
        }
      }
    }

   //4.4 Create openClosedTitlesNoISCIs array
   let openClosedTitlesNoISCIs = openClosedTitles.map(title => title.filter(word => !openClosedISCIs.flat().includes(word)))

   //4.5 Double the length of openClosedTitlesNoISCIs so that it has the format [a, a, b, b, c, c] instead of [a,b,c]. We need to do this because when we put the titles into the grid, spots with open/full versions will be displayed twice.
  let openClosedTitlesNoISCIsDouble = []
  for (let i = 0; i < openClosedTitles.length; i++) {
    openClosedTitlesNoISCIsDouble.push(openClosedTitlesNoISCIs[i])
    openClosedTitlesNoISCIsDouble.push(openClosedTitlesNoISCIs[i])
    }


  //::::::::::::::::\\  //::::::::::::::::\\  //::::::::::::::::\\
  //STEP 5.0: PUSH DATA INTO THE DOM
  //::::::::: :::::::\\  //::::::::::::::::\\  //::::::::::::::::\\


  //5.1 Push ISCIs
  const ISCITable = document.querySelectorAll('.ISCI')
  let ISCITableArray = Array.from(ISCITable)
  let ISCIsAll = openClosedISCIs.concat(singleISCIs)

  //this pushes the dat from the arrays of ISCIs into the table. 

  for (let i = 0; i < ISCIsAll.length; i++) {
    ISCITableArray[i].innerText = ISCIsAll[i]
  }


  //5.2 Push Titles
  const TitleTable = document.querySelectorAll('.title')
  let titleTableArray = Array.from(TitleTable)
  let TitlesAll = openClosedTitlesNoISCIsDouble.concat(singleTitlesNoISCIs)


  TitlesAllFlat = []

  for (let i = 0; i < TitlesAll.length; i++) {
    TitlesAllFlat.push(TitlesAll[i].join(' '))
  }

  for (let i = 0; i < TitlesAll.length; i++) {
    titleTableArray[i].innerText = TitlesAllFlat[i]
  }



console.log('dropped')


// trigger server to do .post request that writes to the excel document 
const data = {ISCIsAll, TitlesAll}
const options = {
  method: 'POST', 
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
}

fetch('/api',options)


//remove the disabled attribute from the download button
const button = document.querySelector('input[type="submit"]')
button.removeAttribute('disabled');

//add green border to bottom section 
const downloadArea = document.querySelector('.downloadArea')
downloadArea.classList.add('green-border')

// 
const excelLogo = document.querySelector('.fa-file-excel');
excelLogo.classList.add('black')

}




