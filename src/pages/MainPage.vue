<template>
  <v-container class="fill-height" fluid>
    <v-layout v-if="!start && !end" class="flex-column justify-center align-center">
      <h1 class="red--text main-title">character structure</h1>
      
      <v-btn @click="letsgo"
             class="mb-3" color="black"
             @mouseenter="buttonHover"
             dark>let's go</v-btn>
      <v-btn color="#888" dark
             @mouseenter="buttonHover"
             @click="buttonClick">go back</v-btn>
    </v-layout>
    
    <v-layout v-else-if="!end" class="flex-column justify-center align-center" :class="{'fade fade-in': true, 'fade-out':end, }">
      <v-btn @click="closeClick" icon class="close-button">
        <v-icon size="40px" color="#F44336">mdi-close-circle</v-icon>
      </v-btn>
      <p :class="['mb-0 pa-5 close-text fade ', {'fade-in': closeTextEnable}]">Hey, you can always click here if you are unsure about the answer.</p>
      
      <h1 class="red--text main-title" :class="['fade', {'fade-in':question}]">find the character for "OUT".</h1>
      
      <v-row :class="{'fade-in':images}" class="fade options-row">
        <v-col sm="4" class="options pa-12 image"
               v-for="(i, index) in list" :key="i"
               :class="[{'active': active == i,
                  'clicked hinted': clicked == index,
                  'move-left': clicked==2 && index==1,
                  'hinted': hinted}, `index-${index}`, `option-${i}`]">
          <v-img :src="require(`../assets/img/${i}.png`)"
                 @mouseenter="mouseover(i)"
                 @mouseleave="mouseleave()"
                 @click="imgClick(i, index)" />
          <template v-if="i==2">
            <img src="../assets/img/fork.png" class="fork fork1">
            <img src="../assets/img/fork.png" class="fork fork2">
          </template>
          <template v-if="i==3">
            <img src="../assets/img/01.png" class="part part1">
            <img src="../assets/img/02.png" class="part part2">
          </template>
          <img src="../assets/img/yellow.png" class="scale">
        </v-col>
      </v-row>
      
      <v-row :class="{'fade hints-row': true, 'fade-in':textBoxEnable==1, 'fade-out':textBoxEnable==2 }">
        <v-col sm="4" class="options"
               v-for="(i, index) in list" :key="i"
               :class="[{'active': active == i, 'clicked': clicked == index, 'move-left': clicked==2 && index==1}, `index-${index}`]">
          <v-layout v-if="textBox[i] != ''" class="text-box py-3 px-3 align-center mt-6">
            <p class="mb-0 mr-3">{{textBox[i]}}</p>
            <v-btn @click="closeTextBox" class="ml-3 hint-btn" color="black" dark>got it!</v-btn>
          </v-layout>
        </v-col>
      </v-row>
    </v-layout>
    
    <v-layout v-if="end" class="flex-column justify-center align-center" :class="{'fade': true, 'fade-in':endEnable, }">
      <h1 class="red--text main-title" :class="{'fade': true, 'fade-in':question, }">Congratulations! </h1>
      <v-row>
        <p style="font-size: 20px;" class="text-center">
          Now you are more familiar with all
          <br>
          these characters! Try our other exercises!
        </p>
      </v-row>
      <v-row>
        <v-btn @click="restart" class="ml-3" color="black" dark>restart</v-btn>
      </v-row>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'MainPage',
    components:{},
    data: () => ({
      start:false,
      question:false,
      images:false,
      textBoxEnable:0,
      closeTextEnable:false,
      endEnable:false,
      active:0,
      clicked:-1,
      list:[1,2,3],
      textBox:{
        1:'',
        2:'',
        3:'',
      },
      end:false,
      hints:{
        1:'',
        2:`Remember we need to put two forks together!\n The character you clicked means “mountain”`,
        3:`It's correct that this character is made up of two parts.\n However, these two parts need to be glued together.`,
      },
      hinted: false,
    }),
    
    mounted() {
      this.list = this.shuffle(this.list)
    },
    
    methods: {
      letsgo(){
        this.playSound(require('../assets/sounds/click letsgo.wav'))
        this.start = true
        this.playSound(require('../assets/sounds/1-19.wav'))
        setTimeout(()=>{
          this.question = true
          this.closeTextEnable = true
          setTimeout(()=>{
            this.closeTextEnable = false
            this.images = true
          }, 2000)
        }, 500)
      },
      playSound (sound) {
        if(sound) {
          var audio = new Audio(sound);
          audio.play();
        }
      },
      shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
      },
      imgClick(i, index){
        this.textBox={
          1:'',
          2:'',
          3:'',
        }
        this.hinted = false
        this.clicked = index
        if(i == 1){
          this.playSound(require('../assets/sounds/correct answer.wav'))
          this.closeTextBox()
          setTimeout(()=>{
            this.end = true
            this.start = false
            setTimeout(()=>{
              this.endEnable = true
            }, 200)
          }, 1000)
        }
        else {
          this.playSound(require('../assets/sounds/highlight.wav'))
          this.textBox[i] = this.hints[i]
          this.clicked = index
          setTimeout(()=>{
            this.playSound(require('../assets/sounds/textbox shows.wav'))
            this.textBoxEnable = 1
          }, 1000)
          setTimeout(()=>{
          }, 1000)
          if(index != 1){
            console.log(index)
          }
        }
      },
      mouseleave(){
        this.active = 0
      },
      mouseover(i){
        this.active = i
        this.playSound(require('../assets/sounds/mouse over.wav'))
      },
      buttonHover(){
        this.playSound(require('../assets/sounds/mouse over.wav'))
      },
      buttonClick(){
        this.playSound(require('../assets/sounds/button click.wav'))
      },
      closeTextBox(){
        this.textBoxEnable=2
        this.hinted = false
        setTimeout(()=>{
          this.textBox={
            1:'',
            2:'',
            3:'',
          }
          this.textBoxEnable=0
          this.clicked=-1
        },1000)
      },
      restart(){
        this.start=false
        this.end=false
        this.active=0
        this.closeTextEnable=false
        this.closeTextBox()
      },
      closeClick(){
        this.buttonClick()
        this.textBox[3] = JSON.parse(JSON.stringify(this.hints[3]))
        this.textBox[2] = JSON.parse(JSON.stringify(this.hints[2]))
        setTimeout(()=>{
          this.active = 1
          this.hinted = true
          this.playSound(require('../assets/sounds/textbox shows.wav'))
          this.textBoxEnable = 1
        }, 500)
      },
    }
  }
</script>

<style lang="scss">
  .options-row{
    width: 100%;
    max-width: 1100px;
    position: relative;
    min-height: 320px;
  }
  .hints-row{
    position: relative;
    width: 100%;
    max-width: 1100px;
  }
  .options{
    border-radius: 20px;
    position: absolute;
    transition: right 0.3s ease;
    .v-image{
      max-width: 250px;
      cursor: pointer;
      transition: all 0.5s ease;
      margin: auto;
      z-index: 1;
    }
    .scale{
      transform: scale(0);
      transition: all 1s ease;
      position: absolute;
      top: 2%;
      width: 90%;
      left: 5%;
    }
    &.image{
      &.clicked,
      &.active{
        padding: 47px !important;
        border: 2px dashed #aaa;
        .v-image{
          transform: scale(1.1);
        }
      }
    }
    &.clicked{
      right: 33.33% !important;
      + .index-1 {
        right: 0;
      }
      .scale{
        transform: scale(1);
      }
    }
    &.index-0 {
      right: 0;
    }
    &.index-1 {
      right: 33.33%;
      &.move-left {
        right: 66.66%;
      }
    }
    &.index-2 {
      right: 66.66%;
    }
  }
  .fade{
    transition: all 1s ease;
    opacity: 0;
  }
  .fade-in{
    transition: all 1s ease !important;
    opacity: 1;
  }
  .fade-out{
    opacity: 0;
  }
  .text-box{
    border: 2px dashed #F44336;
    border-radius: 25px;
    p{
      white-space: pre-line;
    }
  }
  button{
    transition: all 0.2s ease !important;
    &.v-btn:hover {
      padding: 0 25px!important;
    }
    &.hint-btn:hover {
      margin: 0 -9px 0 3px !important;
    }
  }
  .close-button{
    width: 50px;
    height: 50px;
    position: absolute;
    right: 20px;
    z-index: 1;
    top: 20px;
  }
  .close-text{
    position: absolute;
    right: 45px;
    top: 50px;
    border: 2px dashed #F44336;
    border-radius: 25px;
    background: #eee;
    z-index: 1;
  }
  .main-title{
    font-size: 50px !important;
    margin-bottom: 50px;
    text-transform: uppercase;
    transition: all 0s ease;
    text-align: center;
  }
  .option-2{
    .fork {
      position: absolute;
      top: 40%;
      left: 30%;
      width: 40%;
      opacity: 0;
      transition: all 1s ease;
    }
    .fork1 {
      top: 0%;
      width: 30%;
      left: 35%;
    }
    &.hinted {
      .v-image{
        transition-delay: 2s;
        opacity: 0;
      }
      .fork {
        transition-delay: 2s;
        opacity: 1;
      }
      .fork1 {
        top: 10%;
        transition-delay: 4s;
      }
    }
  }
  .option-3{
    .part {
      position: absolute;
      top: 50%;
      left: 20%;
      width: 60%;
      opacity: 0;
      transition: all 1s ease;
    }
    .part1 {
      top: 15%;
      width: 60%;
      left: 20%;
    }
    &.hinted {
      .v-image{
        transition-delay: 2s;
        opacity: 0;
      }
      .part {
        transition-delay: 2s;
        opacity: 1;
      }
      .part1 {
        animation: closing 2s ease 4s infinite;
      }
    }
  }
  @keyframes closing {
    0%{top:15%;}
    50%{top:20%;}
    100%{top:15%;}
  }
</style>