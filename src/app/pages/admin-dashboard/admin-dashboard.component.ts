import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as echarts from 'echarts';
import { ExamService } from '../url.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  allStudentArr: any = {}
  allExamsArr: any = {}
  piedata:any=[]
  subjectsarr:any=[]
  passarr:any=[]
  failarr:any=[]
  totalboys:any=0;
  totalgirls:any=0;
  total:any=0;
  boysmonthy:any;
  girlsmonthy:any;


  constructor(private route: ActivatedRoute, private http: HttpClient ,private ser:ExamService) {


  }



  ngOnInit(): void {
    this.loadform()
  


  }

  graphplot(attr: any, opti: any) {
    var chartDom = document.getElementById(attr);
    var myChart = echarts.init(chartDom);
    var option = opti;
    option && myChart.setOption(option);

  }



  loadform() {

    this.http.get<any>("http://localhost:8771/getdashboarddata").subscribe(async data => {
      
    console.log(data)
      if (data.status == 200) {
        this.allExamsArr = data.data1
        this.allStudentArr = data.data2
       this.piedata=  this.calculatesubjectperformance()
        this.graphplot("subjectperformance", {
          title:{
            text: 'Average overall Subject Performance',
            subtext: 'Strong and weaker Subject',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '10%',
            left: 'left'
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: ['30%', '90%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show:true,
                position:"inside"
              },
              emphasis: {
                label: {
                  show:true,
                  fontSize: 25,
                  fontWeight: 'bold'
                  // ,position:'outside'
                }
              },
              labelLine: {
                show:false
              },
              data:this.piedata
            }
          ]
        })


        this.graphplot("subjectpass", {
          title: {
            text: 'Subject Analysis ',
            // subtext: 'Subject wise Fail,Pass perecntage',
            subtext: 'Pass and Failure',
   
           top:"-1%",
            
            left:"center"
          },
          tooltip: {
            trigger: 'axis'
          },
          
  
          toolbox: {
            show: true,
            feature: {
              dataView: { show: true, readOnly: false },
         
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          calculable: true,
          yAxis: [
            {
            nameGap: 5,
              type: 'category',
              name:"Subject",
              data: this.subjectsarr
            }
          ],
          xAxis: [
            {
              type: 'value', nameGap: 45,
              max: 100, min: 0,gridIndex:0,nameLocation: 'middle'
              ,name: 'Percentage (%)' ,axisLine: {
                show: true  
              }
            }
          ],
          series: [
        
            {
              name: 'Failed Percentage',
              type: 'bar',
              stack: 'total',
              data:this.failarr,
              itemStyle: {
                borderColor: '#000', // Border color
                borderWidth: 1,
                barBorderRadius: [15, 15, 15, 15],
                color: '#F44336' // Specify your custom color here
              }
  
            },    {
              name: 'Passing Percentage',
              type: 'bar',
              stack: 'total',
              itemStyle: {
                // shadowColor: 'rgba(0, 0, 0, 0.3)',
                borderColor: '#fff', // Border color
                borderWidth: 2,
                barBorderRadius:[0, 15, 15, 0],
                color: '#4CAF50' // Specify your custom color here
              },
              data: this.passarr,
  
            }
          ]
        })
       let ret=this.ser.getAverageMarksByMonthforall(this.allStudentArr,this.allExamsArr)
       this.boysmonthy=ret[0]
       this.girlsmonthy=ret[1]
    this.graphplot("lastcontainer", {
      title: {
        text: 'Monthly  Progress Chart',
        subtext: 'Boys vs Girls',
        left: 'left'
      },
      legend: {},
      tooltip: {
        trigger: 'axis',
        showContent: true
      },
      dataset: {
        source: [
          Object.keys(this.boysmonthy),
          Object.values(this.boysmonthy),
          Object.values(this.girlsmonthy),
        ]
      },
      xAxis: { type: 'category' ,name: 'Month',nameLocation: 'middle', nameGap: 45,},
      yAxis: { gridIndex: 0,max:100 ,name: 'Percentage (%)' ,axisLine: {
        show: true // Display line on the y-axis
      }},
  
      series: [
        {
          type: 'line',
          name: 'Boys',
          smooth: true,
          seriesLayoutBy: 'row',
          emphasis: { focus: 'series' }
        },
        {
          type: 'line',
          smooth: true,
          name: 'Girls',
          seriesLayoutBy: 'row',
          emphasis: { focus: 'series' }
        }
      ]
    }) 
      
      
      }
      else {
        Swal.fire({

          icon: "error",
          title: "Some arror occured",
          showConfirmButton: false,
          timer:1500

        });
        // alert("Some arror occured")
      }

    },(error) => {
      Swal.fire({
  
        icon: "error",
        title: `opps!! Internal Server Error `,
        showConfirmButton: false,
        timer: 2500
  
      })
  
  })
  }


  calculatesubjectperformance() {

    for (let item of this.allStudentArr) {
      this.total+=1
      if(item.student_gender=="male"){
        this.totalboys+=1
      }
      else{
        this.totalgirls+=1
      }
    }
    let result:any = []
    let sum,pass,fail;
    let count,cc
    console.log(this.allExamsArr)

    console.log(this.allStudentArr)
    for (let exam of this.allExamsArr) {
      this.subjectsarr.push(exam.exam_name)
      
      sum=0,pass=0,fail=0
      count=0,cc=0
      for (let item of this.allStudentArr) {
        
        for (let item2 of item.student_exams) {
          if(item2.exam_name==exam.exam_name){
            sum+=parseInt(item2.exam_marks,10)
            count+=parseInt(exam.exam_max,10)
            cc++
            
           
            if( parseInt(item2.exam_marks,10)>=parseInt(exam.exam_min,10)){
              pass+=1
              // if(exam.exam_name=="physics"){
              //   console.log(item2.exam_marks)
              //   console.log(exam.exam_min)
              //   console.log(item2.exam_marks>=exam.exam_min)
              // }
            }
            else{
              fail+=1
            }
          }
        }
      }
      this.passarr.push(Math.round(100/(pass+fail)*pass))
      this.failarr.push(Math.round(100/(pass+fail)*fail))
      console.log(exam.exam_name,sum,count,(sum/count),cc)
      result.push({value:Math.round((100*sum/count)/cc),name:exam.exam_name})
      console.log(result)
    

     // Output: 15
      
  
    }
console.log(result)
// console.log(normalizationparm)
console.log(this.passarr)
console.log(this.failarr)
let normalize=0
for (let it in result) {
  normalize+=Math.round(result[it].value)
}
// let normalizationparm: number = result.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);
console.log(normalize)
for (let it in result) {

  result[it].value=(Math.round(100/normalize*result[it].value))

}
// let su: number = result.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);
      
console.log(result);
    return result
  }
}
