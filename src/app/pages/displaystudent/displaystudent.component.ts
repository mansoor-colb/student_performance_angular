import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { ExamService } from '../url.service';
 
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  MarkLineComponent,
  MarkPointComponent,
  ToolboxComponentOption,
  LegendComponent,
  LegendComponentOption,
  DatasetComponent,

} from 'echarts/components';
import { BarChart, PieChart, PieSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { UniversalTransition } from 'echarts/features';
import Swal from 'sweetalert2';

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
  BarChart,
  CanvasRenderer,
  ToolboxComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
  LineChart,
  DatasetComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);

type EChartsOption = echarts.ComposeOption<
  ToolboxComponentOption | LegendComponentOption | PieSeriesOption
>;
@Component({
  selector: 'app-displaystudent',
  templateUrl: './displaystudent.component.html',
  styleUrls: ['./displaystudent.component.css']
})
export class DisplaystudentComponent implements OnInit {
  user_id: any;
  datavalues: any;
  alldatavalues: any;
  examvalues: any;
  monthsarr:any=[]
  averagearr:any={}
  subjectarr: any = [];
  minimumarr: any = [];
  scoredarr: any = [];
  highestarr: any = [];
  total_exams: any;
  assigned_exams: any;
  sub_marks:any=[];
  percent:any;
  constructor(private route: ActivatedRoute, private http: HttpClient,private examService: ExamService) {
    this.user_id = this.route.snapshot.params['userid']

  }

  ngOnInit(): void {
    this.loadform()
  }

  // async  encrypt(str:any) {
  //   var ciphertext = CryptoJS.AES.encrypt(str, "secretthavells").toString();
  //   // console.log(ciphertext)
  //   return ciphertext;
  // }
  
  // async decrypt(str:any) {
  //   var bytes = CryptoJS.AES.decrypt(str, "secretthavells");
  //   console.log(bytes);
  //   var originalText = bytes.toString(CryptoJS.enc.Utf8);
  //   console.log(originalText);
  //   return originalText
  // }
  async  generateString(name:any, dateStr:any, usn:any) {
    const dateComponents = dateStr.split("-");
    const year = dateComponents[0].slice(-2);
    const month = dateComponents[1];
    const day = dateComponents[2];
    const firstThreeLettersOfName = name.slice(0, 3);
    const lastTwoDigitsOfUSN = usn.slice(-2);
  
    const resultString = `${firstThreeLettersOfName}${year}${month}${day}${lastTwoDigitsOfUSN}`;
  
    return resultString;
  }

  graphplot(attr: any, opti: any) {
    var chartDom = document.getElementById(attr);
    var myChart = echarts.init(chartDom);
    var option;
    option = opti
    option && myChart.setOption(option);
  }

  loadform() {
    this.http.post<any>("http://localhost:8771/getstudentexam", { id: this.user_id,admin:1 }).subscribe(async data => {
      this.datavalues = {
        student_name: data.data1.student_name,
        student_email: data.data1.student_email,
        student_usn: data.data1.student_usn,
        student_dob: data.data1.student_dob,
        student_gender: data.data1.student_gender,
        student_password: await this.generateString(data.data1.student_name,data.data1.student_dob,data.data1.student_usn),
        student_exams: data.data1.student_exams,
        student_class:data.data1.student_class
      };
      console.log(this.datavalues.student_password)
      this.examvalues = data.dat2
    
      this.alldatavalues = data.data3
      this.total_exams = this.examvalues.length
      this.assigned_exams = this.datavalues.student_exams.length
      console.log(this.alldatavalues)
      console.log(this.examvalues)
      this.calhighest()

      for (let i=0;i<this.examvalues.length;i++){
        this.monthsarr.push(this.examvalues[i].exam_date)

      }
this.averagearr= this.examService.getAverageMarksByMonth(this.examvalues,this.datavalues.student_exams)
let percentage=0
let maxtotal=0
      for (let item of this.datavalues.student_exams) {
        this.highestarr.push(this.dict[item.exam_name])
        let exm: any = this.examvalues.find((e: { exam_name: string; }) => e.exam_name === item.exam_name)
        this.minimumarr.push(exm.exam_min)
        this.scoredarr.push((item.exam_marks / exm.exam_max) * 100)
        this.subjectarr.push(item.exam_name)

        percentage+=parseInt(item.exam_marks,10)
        maxtotal+=parseInt(exm.exam_max,10)
       
   
        this.sub_marks.push({"value":((item.exam_marks / exm.exam_max) * 100),"name":item.exam_name})
      }
      console.log(data)
console.log(percentage)
console.log(maxtotal)
      this.percent=percentage/maxtotal*100
      this.graphplot("subject", {
        title: {
          text: 'Marks vs Subjects',
          subtext: 'Subject wise Score'
        },
        tooltip: {
          trigger: 'axis'
        },

        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: this.subjectarr
          }
        ],
        yAxis: [
          {
            type: 'value',
            max: 100, min: 0
          }
        ],
        series: [
          {
            name: 'Passing Marks',
            type: 'bar',
            data: this.minimumarr,

          },
          {
            name: 'Scored Marks',
            type: 'bar',
            data: this.scoredarr,

          }, {
            name: 'Highest Scored',
            type: 'bar',
            data: this.highestarr,

          }
        ]
      })
      this.graphplot("perform", {
        title: {
          text: 'Subject  Analysis  Chart',
          subtext: 'Strong and weaker Subject',
          left: 'center'
        },
        legend: {
          top: 'bottom'
        },  label: {
          formatter: '{b}: {d}%'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: 'Subject  Analysis  Chart',
            type: 'pie',
            radius: [10, 200],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: 
             this.sub_marks
            
          }
        ]
      })


      this.graphplot("monthwise", {
        title: {
          text: 'Monthly  Progress Chart',
          subtext: 'Strong and weaker Subject',
          left: 'center'
        },
        legend: {},
        tooltip: {
          trigger: 'axis',
          showContent: true
        },
        dataset: {
          source: [
            Object.keys(this.averagearr),
            Object.values(this.averagearr)
          ]
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0,max:100 },
    
        series: [
          {
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
          }
        ]
      })
      console.log(this.dict)
    },(error) => {
      Swal.fire({
  
        icon: "error",
        title: `opps!! Internal Server Error `,
        showConfirmButton: false,
        timer: 2500
  
      })
  
  })



  }

  dict: any = {}
  calhighest() {
    for (let item of this.alldatavalues) {
      for (let item1 of item.student_exams) {
          if(item.student_class==this.datavalues.student_class){
        let max: any = this.dict.hasOwnProperty(item1.exam_name) ? this.dict[item1.exam_name] : 0;
        if (max == 0) {
          this.dict[item1.exam_name] = item1.exam_marks

        }
        if (max < item1.exam_marks) {
          this.dict[item1.exam_name] = item1.exam_marks
        }
      }      }

    }
  }
getAverageMarksByMonth(studentExams:any, dateStrings:any) {
   
  }
  

  
  
}
