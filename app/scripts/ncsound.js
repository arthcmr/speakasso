
// // Platform compatibility
navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

var NCSOUND = {};
NCSOUND.analyser = null;

NCSOUND.amplitudeTresh= 3;//5;
NCSOUND.energyTresh= 130;
NCSOUND.energyTreshRec=31;
NCSOUND.loudnessTresh= 20;//50;
//Testing Variables
NCSOUND.avg=0;
NCSOUND.max=0;
NCSOUND.min=100;
NCSOUND.i=1;
//------
NCSOUND.silenceLevel=0.3;
NCSOUND.silenceTimestamp;
NCSOUND.silenceTimestampSpeed;
NCSOUND.silenceDuration=250;
NCSOUND.silenceDurationSpeed=30;

NCSOUND.freqsVoice=46;

NCSOUND.prevMaxFrequencyKey=0;
NCSOUND.kurtosisLevel=80;//1500;
NCSOUND.skewnessLevel=4;//5;
NCSOUND.skewnessLevelMin=-1;//5;

NCSOUND.arraySpeech=[];
NCSOUND.tenSec=500; //(number of blocks for 10 seconds)
NCSOUND.counterSec=0;
NCSOUND.speech=false;
NCSOUND.durationSound;
NCSOUND.speedTresh=25;
NCSOUND.recorded;


NCSOUND.init= function(context, source, buffer,getMedia){
    this.analyser=new Meyda(context, source, 512);

    NCSOUND.recorded=getMedia;
}

NCSOUND.get = function(feature) {
       //if an array is received, combine results into an array
       if(_.isArray(feature)) {
             var results = [];
             for(var i = 0; i<feature.length; i++) {
                     results[i] = this.get(feature[i]);
             }
             return results;
       }
       
       //otherwise, its not an array
       var value;
       switch(feature) {
            //we add our features...
             case 'intensity':
                    var ampArray=this.analyser.get('amplitudeSpectrum');
                    var maxAmp=0;
                    var energy=this.analyser.get('energy');
                    var loudness=this.analyser.get('loudness').total;
                    var treshold;
    
                    if(this.recorded){
                        treshold=this.energyTreshRec;
                    }else{
                        treshold=this.energyTresh;
                    }

                    //get HighestAmplitude Frequency
                    // for (freq in ampArray){
                    //     if(ampArray[freq]>maxAmp){
                    //         maxAmp=ampArray[freq];
                    //     }
                    // }


                    //Normalize values between 0 and 100
                
                    // maxAmp= maxAmp*100/this.amplitudeTresh;
                    energy= energy*100/treshold;
                    loudness=loudness*100/this.loudnessTresh;

                    //Output intensity
                    // var intensity= (maxAmp+energy+loudness)/3;
                    var intensity= (energy+loudness)/2;

                    value = intensity;
                 
                    break;  
            case 'silence':
            // Takes NCSOUND.lastSpokenTimestamp into account
            // Returns the duration of the current silence, 0 is no silence. 
            // when silence = 0, silenceDuration = the duration of the current silence, if the silence continous over several calls to the function,the duraiton grows.
            // when silence = 1, silenceDuration = 0;

            var isSilent = true;
            var freqData = this.analyser.get('amplitudeSpectrum');

            for (key in freqData) {
                if (freqData[key] > this.silenceLevel) {
                isSilent = false;
                }
            }
            // Speaking!
            if (!isSilent) {
                this.silenceTimestamp = new Date().getTime();
                value=0;
            }
            // Silent!
            else {
                var timeDif = new Date().getTime() - this.silenceTimestamp;
                if (timeDif > this.silenceDuration) {
                    // Suddenly, silence.
                    value=timeDif;    
                } else {
                    // The silence is too young.
                    value=0;              
                }
            }
                break;
            case 'emotion':
                    var freqData = this.analyser.get('amplitudeSpectrum');
                    var maxAmpKey=0, maxAmp=0;
                    var skewness= this.analyser.get('spectralSkewness')
                    var kurtosis= this.analyser.get('spectralKurtosis'); // how flat the signal is around its mean (>0 pickier, <0 flatter)
                    var maxBandLoudness=0, maxBandLoudnessKey=0;
                    var loudnessArray= this.analyser.get('loudness').specific;
                    var silence=true;

                    //get the key of the highest amplitude frequency, the largest the key, the highest the pitch, the more emotion.
                    //particularly true when there is a significant change from the previous frequency.
                    for (key=0; key<this.freqsVoice; key++) {
                        if (freqData[key] > maxAmp) {
                            maxAmpKey=key;
                            maxAmp=freqData[key];
                        }

                        if(freqData[key]>this.silenceLevel){
                            silence=false;
                        }
                    }

                    // if (!silence){
                        var difMaxFreqs=maxAmpKey-this.prevMaxFrequencyKey;

                        //NormalizeMax Amplitudes and Differences
                        maxAmpKey=maxAmpKey*100/(this.freqsVoice-1);
                        difMaxFreqs=Math.abs(difMaxFreqs)*100/(this.freqsVoice-1);

                        var pitchVariance=(maxAmpKey+difMaxFreqs)/2;  //djsdjsadisadisdisadiasd
                        //var pitchVariance=difMaxFreqs;

                        this.prevMaxFreqKey=maxAmpKey;

                        //Loudness
                        for (band=0; band<19;band++){
                            if (loudnessArray[band]>maxBandLoudness){
                                maxBandLoudnessKey=band;
                                maxBandLoudness= loudnessArray[band];
                            }
                        }
                        
                        //Normalize Loundess index
                        maxBandLoudnessKey=maxBandLoudnessKey*100/(19-1);

                        //Normalize Skewness
                        skewness=(skewness-this.skewnessLevelMin)*100/(this.skewnessLevel-this.skewnessLevelMin);
                       

                        //Normalize Kurtosis
                        kurtosis=Math.abs(((kurtosis+this.kurtosisLevel)*100/((this.kurtosisLevel)*2))-100);

                        var spectrumFeatures=(skewness+kurtosis)/2;
                        
                        value= (spectrumFeatures+maxBandLoudnessKey+pitchVariance)/3;
                    // }else{
                    //     value=0;
                    // }    
                    break;
            case 'speed':
                    var isSilent = true;
                    var freqData = this.analyser.get('amplitudeSpectrum');
                    var speed=0;

                    for (key in freqData) {
                        if (freqData[key] > this.silenceLevel) {
                            isSilent = false;
                        }
                    }
         
                    if (isSilent) {
                        this.silenceTimestampSpeed = new Date().getTime();
                        if (this.speech){
                            this.arraySpeech[this.counterSec]= this.durationSound;
                            this.speech=false;
                        }else{
                            this.arraySpeech[this.counterSec]=0;
                        }
                    }
                    else {
                        var timeDif = new Date().getTime() - this.silenceTimestampSpeed;
                        if (timeDif > this.silenceDurationSpeed) {
                            this.durationSound=timeDif;
                            this.speech=true;    
                        }
                        this.arraySpeech[this.counterSec]=0; 
                    }

                    this.counterSec+=1;

                    if (this.counterSec>this.tenSec){
                        this.counterSec=0;
                    }

                    for (i in this.arraySpeech){
                        if(this.arraySpeech[i]>0){
                            speed+=1;
                        }
                    }
                    
                    speed=speed*100/this.speedTresh;
                     // console.log(speed);
         
                    value=speed;
               break;
             // case 'mfcc':
             //         var mfcc=this.analyser.get('mfcc');

             //         if(this.max<mfcc){
             //             this.max=mfcc;
             //         }


             //         if(this.min>mfcc){
             //             this.min=mfcc;
             //         }

             //         this.avg=(this.avg*(this.i-1)+mfcc)/this.i;
             //         console.log (mfcc);
             //         console.log (this.i);
             //         console.log ("Avg "+this.avg);
             //         console.log ("Max "+this.max);
             //         console.log ("Min "+this.min);
             //         this.i+=1;

             //         value=mfcc;

             //        break;
             // //in case its not a customized feature, try meyda default ones
             default:
                    value = this.analyser.get(feature);
                    break;

       }
       return value;
}
