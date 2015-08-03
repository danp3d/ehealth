(function() {
  angular.module('ehealth').factory('utilsSvc', function() {
    return {
      getAgeYears: function(dt, complete) {
        var years;
        years = new Date(Date.now() - dt.getTime()).getUTCFullYear() - 1970;
        if (complete) {
          years += (this.getAgeMonths(dt)) / 12;
          years += ((this.getAgeDays(dt)) / 30) / 12;
        }
        return years;
      },
      getAgeMonths: function(dt) {
        return new Date(Date.now() - dt.getTime()).getUTCMonth();
      },
      getAgeDays: function(dt) {
        return new Date(Date.now() - dt.getTime()).getUTCDate();
      },
      translateActivityFactor: function(factor) {
        var descr;
        factor = parseFloat(factor);
        if (!factor) {
          factor = 1.1;
        }
        descr = factor.toFixed(1) + '. ';
        if (factor > 1 && factor < 1.5) {
          descr += 'Muito leve';
        }
        if (factor > 1.4 && factor < 1.7) {
          descr += 'Leve';
        }
        if (factor > 1.6 && factor < 2.1) {
          descr += 'Moderada';
        }
        if (factor > 2.0 && factor < 2.4) {
          descr += 'Intensa';
        }
        if (factor >= 2.4) {
          descr += 'Muito Intensa';
        }
        return descr;
      },
      translateIntensityToVO2Max: function(intensity, type, dob) {
        var intens, result;
        if (type === 'cardio') {
          return intensity / 100;
        }
        result = intensity;
        if (intensity <= 39) {
          intens = intensity * 29 / 39;
        }
        if (intensity >= 40 && intensity <= 59) {
          intens = (intensity - 40) * 2.06 + 30;
        }
        if (intensity >= 60 && intensity <= 79) {
          intens = (intensity - 60) * 0.53 + 70;
        }
        if (intensity >= 80) {
          intens = intensity;
        }
        return intens / 100;
      },
      translateWorkoutIntensity: function(intensity, type) {
        var descr;
        if (!type) {
          type = 'cardio';
        }
        intensity = parseInt(intensity);
        if (!intensity) {
          intensity = 0;
        }
        descr = intensity + '. ';
        if (type === 'cardio') {
          if (intensity === 0) {
            descr += 'Nenhum esforço';
          }
          if (intensity >= 1 && intensity <= 20) {
            descr += 'Extremamente leve';
          }
          if (intensity >= 21 && intensity <= 59) {
            descr += 'Leve';
          }
          if (intensity >= 60 && intensity <= 69) {
            descr += 'Moderado';
          }
          if (intensity >= 70 && intensity <= 79) {
            descr += 'Difícil';
          }
          if (intensity >= 80 && intensity <= 89) {
            descr += 'Muito difícil';
          }
          if (intensity >= 90 && intensity <= 99) {
            descr += 'Extremamente difícil';
          }
          if (intensity === 100) {
            descr += 'Exaustão';
          }
          if (intensity >= 28 && intensity <= 42) {
            descr += ' - Exercício regenerativo';
          }
          if (intensity >= 43 && intensity <= 56) {
            descr += ' - Perda de gordura';
          }
          if (intensity >= 57 && intensity <= 70) {
            descr += ' - Condicionamento aeróbico';
          }
          if (intensity >= 71 && intensity <= 83) {
            descr += ' - Limiar anaeróbico';
          }
          if (intensity >= 84 && intensity <= 100) {
            descr += ' - Esforço máximo';
          }
        } else {
          if (intensity === 0) {
            descr += 'Nenhum esforço';
          }
          if (intensity >= 1 && intensity <= 19) {
            descr += 'Demasiado leve';
          }
          if (intensity >= 20 && intensity <= 29) {
            descr += 'Muito leve';
          }
          if (intensity >= 30 && intensity <= 39) {
            descr += 'Leve';
          }
          if (intensity >= 40 && intensity <= 59) {
            descr += 'Moderado';
          }
          if (intensity >= 60 && intensity <= 79) {
            descr += 'Pesado';
          }
          if (intensity >= 80 && intensity <= 89) {
            descr += 'Muito pesado';
          }
          if (intensity >= 90 && intensity <= 100) {
            descr += 'Extremamente pesado';
          }
        }
        return descr;
      },
      translateWorkoutType: function(type) {
        if (type === 'cardio') {
          return 'Cardiovascular (aeróbico)';
        }
        if (type === 'strength') {
          return 'Força (anaeróbico)';
        }
        return '';
      },
      convertVO2MlToL: function(vo2Ml, bodyWeight) {
        return vo2Ml * bodyWeight / 1000;
      },
      getMaxCF: function(age) {
        var cf, cfMax, difference, differnece;
        cfMax = 220 - age;
        if (age <= 25) {
          difference = 10;
        }
        if (age > 25) {
          differnece = 12;
        }
        return cf = {
          from: cfMax - difference,
          to: cfMax + difference
        };
      },
      convertMaxCFtoResCF: function(maxCF, restCF) {
        var cf;
        return cf = {
          from: maxCF.from - restCF,
          to: maxCF.to - restCF
        };
      },
      getWorkoutCF: function(resCF, intensity, restCF) {
        var cf;
        return cf = {
          from: resCF.from * (intensity / 100) + restCF,
          to: resCF.to * (intensity / 100) + restCF
        };
      },
      calculateCalories: function(vo2L, intensity, workoutDuration, type) {
        var cals, correction, vo2MaxPercent;
        vo2MaxPercent = this.translateIntensityToVO2Max(intensity, type);
        cals = vo2L * vo2MaxPercent * 5 * workoutDuration;
        if (type === 'cardio') {
          correction = 0;
        }
        if (type === 'strength') {
          if (vo2MaxPercent > 0.45) {
            correction = cals * 0.06;
          } else if (vo2MaxPercent <= 0.45 && vo2MaxPercent > 0.29) {
            correction = cals * 0.25;
          }
        }
        return cals - correction;
      },
      calculateBasalMetabolicRate: function(weight, height, dob, sex) {
        var bmr;
        if (sex === 'f') {
          bmr = 655.1 + (9.5 * weight) + (1.8 * height) - (4.7 * this.getAgeYears(dob, true));
        } else {
          bmr = 66.5 + (13.8 * weight) + (5 * height) - (6.8 * this.getAgeYears(dob, true));
        }
        return bmr;
      },
      calculateDailyMetabolicRate: function(basalMetabolicRate, activityFactor) {
        return parseFloat(basalMetabolicRate * activityFactor).toFixed(3);
      },
      calculateTotalMetabolicRate: function(dailyMetabolicRate, caloriesSpentWithWorkouts) {
        return dailyMetabolicRate + caloriesSpentWithWorkouts;
      },
      calculateLeanMass: function(weight, bodyFat) {
        return ((100 - bodyFat) / 100) * weight;
      },
      calculateMaxGainRate: function(leanMass, experienced) {
        var gint, magicVal, rate, remain, suff;
        experienced = !!experienced;
        magicVal = experienced ? 268 : 148;
        rate = leanMass / magicVal;
        remain = rate % 100;
        gint = Math.round(rate);
        remain = rate - gint;
        suff = Math.round(remain * 100);
        rate = gint + suff / 100;
        return parseFloat(rate).toFixed(3);
      },
      calculateOptimalNutrientIngestionForMassGain: function(leanMass, maxGainRate, activityFactor) {
        var carbs, fat, gaincals, gainrateCals, proteins, toReturn;
        gainrateCals = 1.15 * ((maxGainRate * 453 / 7) * 1.63 + ((maxGainRate * 454 / 7) / 3) * 7.91);
        gaincals = Math.round(((370 + (9.8 * leanMass)) * activityFactor) + gainrateCals);
        proteins = Math.round(0.907 * leanMass);
        fat = Math.round(0.3 * gaincals / 9);
        carbs = Math.round((gaincals - 0.3 * gaincals - 4 * proteins) / 4);
        toReturn = {
          "calories": parseFloat(gaincals).toFixed(3),
          "proteins": parseFloat(proteins).toFixed(3),
          "fat": parseFloat(fat).toFixed(3),
          "carbs": parseFloat(carbs).toFixed(3)
        };
        return toReturn;
      }
    };
  });

}).call(this);
