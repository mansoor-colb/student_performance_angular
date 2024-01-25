import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class ExamService {
  mon_sub: any = {}


  constructor(private http: HttpClient) { }
  getExamMaxBySubject(subjectName: any, examData: any) {
    const exam: any = examData.find((entry: any) => entry.exam_name === subjectName);

    if (exam) {
      return exam.exam_max;
    } else {
      return null;
    }
  }


  getAverageMarksByMonth(exams: any, students: any): any {
    let datearray = []
    for (let item1 of exams) {
      let dt = new Date(item1.exam_date).getMonth() + 1
      console.log(dt)
      datearray.push(item1.exam_date)

      let arr: any[] = this.mon_sub.hasOwnProperty(dt) ? this.mon_sub[dt] : [];
      for (let i = 0; i < exams.length; i++) {
        if (exams[i].exam_date == item1.exam_date) {
          arr.push(exams[i].exam_name)
        }
      }
      this.mon_sub[dt] = arr
    }


    const dateObjects = datearray.map(dateString => new Date(dateString));
    dateObjects.sort((a: any, b: any) => a - b);
    const sortedDateStrings = dateObjects.map(dateObject => dateObject.toISOString().split('T')[0]);
    console.log(sortedDateStrings)
    const entriesArray = Object.entries(this.mon_sub);
    entriesArray.sort((a, b) => a[0].localeCompare(b[0]));
    const sortedObject: any = Object.fromEntries(entriesArray);
    console.log(sortedObject)
    let resu: any = {}
    let count: any = {}
    for (let item in sortedObject) {
      resu[item] = 0
      count[item] = 0
      let i = 1;

      for (let item1 of students) {
        if (sortedObject[item].includes(item1.exam_name)) {
          console.log(item + " " + item1.exam_name)
          let max: any = resu.hasOwnProperty(item) ? resu[item] : 0;
          resu[item] = parseInt(max, 10) + (parseInt(item1.exam_marks, 10) / this.getExamMaxBySubject(item1.exam_name, exams) * 100)
          count[item] = i++
        }

      }
    }


    for (let item in resu) {
      if (resu[item] != 0) {
        resu[item] = resu[item] / count[item]
      }
    }
    let result: any = {}
    for (let item in resu) {
      result[`2024-0${item}`] = Math.round(resu[item])
    }


    console.log(resu)
    console.log(count)
    return result
  }





  getAverageMarksByMonthforall(studentdata: any,exams: any): any {
    console.log(exams)
    console.log(studentdata)
    let datearray = []
    for (let item1 of exams) {
      let dt = new Date(item1.exam_date).getMonth() + 1
      console.log(dt)
      datearray.push(item1.exam_date)

      let arr: any[] = this.mon_sub.hasOwnProperty(dt) ? this.mon_sub[dt] : [];
      for (let i = 0; i < exams.length; i++) {
        if (exams[i].exam_date == item1.exam_date) {
          arr.push(exams[i].exam_name)
        }
      }
      this.mon_sub[dt] = arr
    }


    const dateObjects = datearray.map(dateString => new Date(dateString));
    dateObjects.sort((a: any, b: any) => a - b);
    const sortedDateStrings = dateObjects.map(dateObject => dateObject.toISOString().split('T')[0]);
    console.log(sortedDateStrings)
    const entriesArray = Object.entries(this.mon_sub);
    entriesArray.sort((a, b) => a[0].localeCompare(b[0]));
    const sortedObject: any = Object.fromEntries(entriesArray);
    console.log(sortedObject)
    let resu: any = {}
    let count: any = {}
    let countfem: any = {}
    let resufem: any = {}
    for (let item in sortedObject) {
      resu[item] = 0
      resufem[item]=0
      count[item] = 0
      countfem[item]=0
      let i = 1;
      let j=1;
for (let itemn of studentdata){
  if(itemn.student_gender=="male"){
      for (let item1 of itemn.student_exams) {
        if (sortedObject[item].includes(item1.exam_name)) {
          console.log(item + " " + item1.exam_name)
          let max: any = resu.hasOwnProperty(item) ? resu[item] : 0;
          resu[item] = parseInt(max, 10) + (parseInt(item1.exam_marks, 10) / this.getExamMaxBySubject(item1.exam_name, exams) * 100)
          count[item] = i++
        }
      }
    }
    else{
      for (let item1 of itemn.student_exams) {
        if (sortedObject[item].includes(item1.exam_name)) {
          console.log(item + " " + item1.exam_name)
          let max: any = resufem.hasOwnProperty(item) ? resufem[item] : 0;
          resufem[item] = parseInt(max, 10) + (parseInt(item1.exam_marks, 10) / this.getExamMaxBySubject(item1.exam_name, exams) * 100)
          countfem[item] = j++
        }
      }
    }
    }
  }
    

    for (let item in resu) {
      if (resu[item] != 0) {
        resu[item] = resu[item] / count[item]
      }
    }

    for (let item in resufem) {
      if (resufem[item] != 0) {
        resufem[item] = resufem[item] / countfem[item]
      }
    }


    let result: any = {}
    let result2: any = {}
    for (let item in resu) {
      result[`2024-0${item}`] = Math.round(resu[item])
    }

    for (let item in resufem) {
      result2[`2024-0${item}`] = Math.round(resufem[item])
    }


    console.log(result2)
    console.log(result)
    // console.log(count)
    return [result,result2]
  }

}
