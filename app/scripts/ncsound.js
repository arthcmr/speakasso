// // Platform compatibility
navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

var NCSOUND = {};
NCSOUND.analyser = null;

NCSOUND.amplitudeTresh = 5;
NCSOUND.energyTresh = 130;
NCSOUND.loudnessTresh = 50;
//Testing Variables
NCSOUND.avg = 0;
NCSOUND.max = 0;
NCSOUND.min = 100;
NCSOUND.i = 1;
//------
NCSOUND.silenceLevel = 0.3;
NCSOUND.silenceTimestamp;
NCSOUND.silenceDuration = 250;

NCSOUND.prevMaxFrequencyKey = 0;
NCSOUND.kurtosisLevel = 1500;
NCSOUND.skewnessLevel = 5;

NCSOUND.init = function(context, source, buffer) {
    this.analyser = new Meyda(context, source, 512);
}


NCSOUND.get = function(feature) {
    //if an array is received, combine results into an array
    if (_.isArray(feature)) {
        var results = [];
        for (var i = 0; i < feature.length; i++) {
            results[i] = this.get(feature[i]);
        }
        return results;
    }

    //otherwise, its not an array
    var value;
    switch (feature) {
        //we add our features...
        case 'intensity':
            var ampArray = this.analyser.get('amplitudeSpectrum');
            var maxAmp = 0;
            var energy = this.analyser.get('energy');
            var loudness = this.analyser.get('loudness').total;


            //get HighestAmplitude Frequency
            for (freq in ampArray) {
                if (ampArray[freq] > maxAmp) {
                    maxAmp = ampArray[freq];
                }
            }

            //Normalize values between 0 and 100
            maxAmp = maxAmp * 100 / this.amplitudeTresh;
            energy = energy * 100 / this.energyTresh;
            loudness = loudness * 100 / this.loudnessTresh;

            //Output intensity
            var intensity = (maxAmp + energy + loudness) / 3;

            value = intensity;
            break;
        case 'silence':
            //From raw freq data to 0 or 1: silence or speech, compare max decibel value to NCSOUND.silenceLevel
            // Takes NCSOUND.lastSpokenTimestamp into account
            // Returns and array [silence (boolean), silenceDuration (ms)]
            // when silence = 0, silenceDuration = the duration of the current silence, if the silence continous over several calls to the function,the duraiton grows.
            // when silence = 1, silenceDuration = 0;
            var isSilent = true;
            var freqData = this.analyser.get('amplitudeSpectrum');
            value = [];

            for (key in freqData) {
                if (freqData[key] > this.silenceLevel) {
                    isSilent = false;
                }
            }
            // Speaking!
            if (!isSilent) {
                this.silenceTimestamp = new Date().getTime();
                value[0] = 1;
                value[1] = 0;
            }
            // Silent!
            else {
                var timeDif = new Date().getTime() - this.silenceTimestamp;
                if (timeDif > this.silenceDuration) {
                    // Suddenly, silence.
                    value[0] = 0;
                    value[1] = timeDif;
                } else {
                    // The silence is too young.
                    value[0] = 1;
                    value[1] = 0;
                }
            }
            break;
        case 'emotion':
            var freqData = this.analyser.get('amplitudeSpectrum');
            var maxAmpKey = 0,
                maxAmp = 0;
            var skewness = this.analyser.get('spectralSkewness')
            var kurtosis = this.analyser.get('spectralKurtosis'); // how flat the signal is around its mean (>0 pickier, <0 flatter)
            var maxBandLoudness = 0,
                maxBandLoudnessKey = 0;
            var loudnessArray = this.analyser.get('loudness').specific;
            var silence = true;

            //get the key of the highest amplitude frequency, the largest the key, the highest the pitch, the more emotion.
            //particularly true when there is a significant change from the previous frequency.
            for (key in freqData) {
                if (freqData[key] > maxAmp) {
                    maxAmpKey = key;
                    maxAmp = freqData[key];
                }

                if (freqData[key] > this.silenceLevel) {
                    silence = false;
                }
            }

            var difMaxFreqs = maxAmpKey - this.prevMaxFrequencyKey;

            //NormalizeMax Amplitudes and Differences
            maxAmpKey = maxAmpKey * 100 / (freqData.length - 1);
            difMaxFreqs = Math.abs(difMaxFreqs) * 100 / (freqData.length - 1);

            var pitchVariance = (maxAmpKey + difMaxFreqs) / 2;

            this.prevMaxFreqKey = maxAmpKey;

            //Loudness
            for (band in loudnessArray) {
                if (loudnessArray[band] > maxBandLoudness) {
                    maxBandLoudnessKey = band;
                    maxBandLoudness = loudnessArray[band];
                }
            }

            //Normalize Loundess index
            maxBandLoudnessKey = maxBandLoudnessKey * 100 / (loudnessArray.length - 1);

            //Normalize Skewness
            skewness = skewness * 100 / this.skewnessLevel;
            //Normalize Kurtosis

            kurtosis = (kurtosis + this.kurtosisLevel) * 100 / ((this.kurtosisLevel) * 2);

            if (!silence) {
                var spectrumFeatures = (skewness + kurtosis) / 2;
            } else {
                var spectrumFeatures = 0;
            }

            value = (spectrumFeatures + maxBandLoudnessKey + pitchVariance) / 3;
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