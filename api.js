'use strict'
const fs = require('fs');

module.exports = {
  getHealth, putStudent, getStudent, deleteStudent
}

async function getHealth (req, res, next) {
  res.json({ success: true })
}

// CHECK IF IT'S JSON OR NOT
function isJSON(data) {
  var ret = true;
  try {
     JSON.parse(data);
  }catch(e) {
     ret = false;
  }
  return ret;
}
//FILTER EMPTY ELEMENTS
function filterEmpty(arr){
  var filteredArr = []
  for(var i = 0; i< arr.length; i++)
    if(arr[i] != '')
      filteredArr.push(arr[i])
  return filteredArr
}
// CHECK IF VALARIABLE IS STRING OR NOT
function isTypeString(param)
{
  if(typeof param === 'string' || param instanceof String)
    return true
  else
    return false
}

// PUT STUDENT PROPERTY
async function putStudent(req, res, next){
  let studentId = req.params.studentId
  let properties = req.params[0].split('/')
  properties = filterEmpty(properties)
  let propertyContent = req.body;
  let filePath = "data/"+studentId+".json";
  fs.exists(filePath, function(exists) {
    //File exist
    if(exists){
      fs.readFile(filePath, 'utf8', (err, data) => {
        if(err) {
          res.send({status: 404, message: err})
        }
        else{
          try{
            let fileContent;
            fileContent = JSON.parse(data);
            let propertyItem = fileContent
            for(var i=0; i<properties.length;i++){
              var property = properties[i]
              if(propertyItem.hasOwnProperty(property))
              {
                if(isTypeString(propertyItem[property]))
                {
                  propertyItem[property] = {}
                  propertyItem = propertyItem[property];
                }
                else
                  propertyItem = propertyItem[property]                
              }
              else{
                propertyItem[property] = {}
                propertyItem = propertyItem[property];
              }
            }
            for(var key in propertyContent){
              propertyItem[key] = propertyContent[key]
            }
            let fileContentStr = JSON.stringify(fileContent)
            fs.writeFile(filePath, fileContentStr, 'utf8', (err) => {
              if(err) throw err
              console.log(fileContent + " written to " + filePath)
              res.send(fileContent)
            }) 
          }catch(e) {console.log(e); res.send({status: 404, message: e})}
        }
      })
    }
    //File Not Exist
    else{
      try{
        var fileContent = {}
        var propertyItem = fileContent
        for(var i=0; i<properties.length-1;i++){
          var property = properties[i]
          propertyItem[property] = {}
          propertyItem = propertyItem[property];
        }
        for(var key in propertyContent){
          let lastProperty = properties[properties.length-1]
          if(lastProperty == ''){
            propertyItem[key] = propertyContent[key]
          }
          else{
            if(!propertyItem.hasOwnProperty(lastProperty))
              propertyItem[lastProperty] = {}
            propertyItem[lastProperty][key] = propertyContent[key]
          }
        }
        fileContent = JSON.stringify(fileContent)
        fs.writeFile(filePath, fileContent, (err) => {
          if(err) throw err;
          console.log("written to" + filePath);
          res.send(JSON.parse(fileContent))
        });
      }catch(e) {
        console.log(e);
        res.send({status: 404, message: e})
      }
    }
  })
}

// GET STUDENT PROPERTY
async function getStudent (req, res, next) {
  let studentId = req.params.studentId
  let properties = req.params[0].split('/');
  properties = filterEmpty(properties)
  let filePath = "data/" + studentId + ".json"

  fs.exists(filePath, function(exists) {
    //File exist
    if(exists){
      fs.readFile(filePath, 'utf8', (err, data) => {
        if(!err){
          let fileContent;
          fileContent = JSON.parse(data);
          let propertyItem = fileContent;
          let isExistProperty = true;
          try{
            properties.forEach(property => {
              if(propertyItem.hasOwnProperty(property)){
                propertyItem = propertyItem[property]
              } else{
                isExistProperty = false;
                throw breakException;
              }
            });
            if(isExistProperty){
              res.send(propertyItem);
            } else{
              res.send({status: 404, message: "property not exist"})
            }
          } catch(e) { res.send({status: 404, message: "property not found"})} 
        }
      })
    }
    //File Not Exist
    else{
      res.send({'status' : 404, message: "file not exist"});
    }
  })
}

// DELETE STUDENT PROPERTY
async function deleteStudent (req, res, next) {
  let studentId = req.params.studentId
  let properties = req.params[0].split('/');
  properties = filterEmpty(properties)
  let filePath = "data/" + studentId + ".json"

  fs.exists(filePath, function(exists) {
    //File exist
    if(exists){
      fs.readFile(filePath, 'utf8', (err, data) => {
        if(!err){
          let fileContent;
          fileContent = JSON.parse(data);
          let propertyItem = fileContent;
          let isExistProperty = true;
          try{
            for(var i=0; i<properties.length-1; i++){
              var property = properties[i]
              if(propertyItem.hasOwnProperty(property)){
                propertyItem = propertyItem[property]
              } else{
                isExistProperty = false;
                throw breakException;
              }
            }
            if(isExistProperty){
              var lastProperty = properties[properties.length-1]
              if(propertyItem.hasOwnProperty(lastProperty)){
                delete propertyItem[lastProperty]
                fileContent = JSON.stringify(fileContent)
                fs.writeFile(filePath, fileContent, (err) => {
                  if(err) throw err;
                  console.log("written to" + filePath);
                  res.send({status: 200, message: "property removed"})
                });
              }
              else{
                res.send({status: 404, message: "property not exist"})
              }
            } else{
              res.send({status: 404, message: "property not exist"})
            }
          } catch(e) { res.send({status: 404, message: "property not found"})} 
        }
      })
    }
    //File Not Exist
    else{
      res.send({'status' : 404, message: "file not exist"});
    }
  })
}