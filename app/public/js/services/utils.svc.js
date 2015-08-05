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
      getCorrection: function(type, cals, vo2MaxPercent) {
        var correction;
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
        return correction;
      },
      calculateCalories: function(vo2L, intensity, workoutDuration, type) {
        var cals, correction, vo2MaxPercent;
        vo2MaxPercent = this.translateIntensityToVO2Max(intensity, type);
        cals = vo2L * vo2MaxPercent * 5 * workoutDuration;
        correction = this.getCorrection(type, cals, vo2MaxPercent);
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
      getIdealBodyFatRate: function() {
        if (sex === 'f') {
          if (age <= 25) {
            return 19;
          } else if (age <= 35) {
            return 20;
          } else if (age <= 45) {
            return 23;
          } else if (age <= 55) {
            return 25;
          } else {
            return 26;
          }
        } else {
          if (age <= 25) {
            return 10;
          } else if (age <= 35) {
            return 15;
          } else if (age <= 45) {
            return 18;
          } else if (age <= 55) {
            return 20;
          } else {
            return 21;
          }
        }
      },
      rateBodyFatPerAge: function(bodyFat, dob, sex) {
        var age;
        age = getAgeYears(dob);
        if (sex === 'f') {
          if (age <= 25) {
            if (bodyFat <= 16) {
              return 'excellent';
            }
            if (bodyFat <= 19) {
              return 'good';
            }
            if (bodyFat <= 22) {
              return 'average+';
            }
            if (bodyFat <= 25) {
              return 'average';
            }
            if (bodyFat <= 28) {
              return 'average-';
            }
            if (bodyFat <= 31) {
              return 'bad';
            }
            return 'worse';
          } else if (age <= 35) {
            if (bodyFat <= 16) {
              return 'excellent';
            }
            if (bodyFat <= 20) {
              return 'good';
            }
            if (bodyFat <= 23) {
              return 'average+';
            }
            if (bodyFat <= 25) {
              return 'average';
            }
            if (bodyFat <= 29) {
              return 'average-';
            }
            if (bodyFat <= 33) {
              return 'bad';
            }
            return 'worse';
          } else if (age <= 45) {
            if (bodyFat <= 19) {
              return 'excellent';
            }
            if (bodyFat <= 23) {
              return 'good';
            }
            if (bodyFat <= 26) {
              return 'average+';
            }
            if (bodyFat <= 29) {
              return 'average';
            }
            if (bodyFat <= 32) {
              return 'average-';
            }
            if (bodyFat <= 36) {
              return 'bad';
            }
            return 'worse';
          } else if (age <= 55) {
            if (bodyFat <= 21) {
              return 'excellent';
            }
            if (bodyFat <= 25) {
              return 'good';
            }
            if (bodyFat <= 28) {
              return 'average+';
            }
            if (bodyFat <= 31) {
              return 'average';
            }
            if (bodyFat <= 34) {
              return 'average-';
            }
            if (bodyFat <= 38) {
              return 'bad';
            }
            return 'worse';
          } else {
            if (bodyFat <= 22) {
              return 'excellent';
            }
            if (bodyFat <= 26) {
              return 'good';
            }
            if (bodyFat <= 29) {
              return 'average+';
            }
            if (bodyFat <= 32) {
              return 'average';
            }
            if (bodyFat <= 35) {
              return 'average-';
            }
            if (bodyFat <= 38) {
              return 'bad';
            }
            return 'worse';
          }
        } else {
          if (age <= 25) {
            if (bodyFat <= 6) {
              return 'excellent';
            }
            if (bodyFat <= 10) {
              return 'good';
            }
            if (bodyFat <= 13) {
              return 'average+';
            }
            if (bodyFat <= 16) {
              return 'average';
            }
            if (bodyFat <= 20) {
              return 'average-';
            }
            if (bodyFat <= 24) {
              return 'bad';
            }
            return 'worse';
          } else if (age <= 35) {
            if (bodyFat <= 11) {
              return 'excellent';
            }
            if (bodyFat <= 15) {
              return 'good';
            }
            if (bodyFat <= 18) {
              return 'average+';
            }
            if (bodyFat <= 20) {
              return 'average';
            }
            if (bodyFat <= 24) {
              return 'average-';
            }
            if (bodyFat <= 28) {
              return 'bad';
            }
            return 'worse';
          } else if (age <= 45) {
            if (bodyFat <= 14) {
              return 'excellent';
            }
            if (bodyFat <= 18) {
              return 'good';
            }
            if (bodyFat <= 21) {
              return 'average+';
            }
            if (bodyFat <= 23) {
              return 'average';
            }
            if (bodyFat <= 25) {
              return 'average-';
            }
            if (bodyFat <= 29) {
              return 'bad';
            }
            return 'worse';
          } else if (age <= 55) {
            if (bodyFat <= 16) {
              return 'excellent';
            }
            if (bodyFat <= 20) {
              return 'good';
            }
            if (bodyFat <= 23) {
              return 'average+';
            }
            if (bodyFat <= 25) {
              return 'average';
            }
            if (bodyFat <= 27) {
              return 'average-';
            }
            if (bodyFat <= 30) {
              return 'bad';
            }
            return 'worse';
          } else {
            if (bodyFat <= 18) {
              return 'excellent';
            }
            if (bodyFat <= 21) {
              return 'good';
            }
            if (bodyFat <= 23) {
              return 'average+';
            }
            if (bodyFat <= 25) {
              return 'average';
            }
            if (bodyFat <= 27) {
              return 'average-';
            }
            if (bodyFat <= 30) {
              return 'bad';
            }
            return 'worse';
          }
        }
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
      },
      calculateBodyFatKg: function(weight, bodyFat) {
        return (bodyFat / 100) * weight;
      },
      calculateIdealWeight: function(leanBodyMass, idealBodyFat) {
        return leanBodyMass / (1 - (idealBodyFat / 100));
      },
      calculateExceedingFatkg: function(bodyFat, idealBodyFat, weight) {
        return ((bodyFat - idealBodyFat) * weight) / 100;
      },
      calculateLeanBodyMassRate: function(bodyFat, weight) {
        return (100 - bodyFat) / 100 * weight;
      },
      calculateLeanBodyMass: function(leanBodyMassRate, weight) {
        return (leanBodyMassRate / 100) * weight;
      },
      rateLeanBodyMassRate: function(leanBodyMassRate, sex) {
        if (sex === 'f') {
          if (leanBodyMassRate < 77) {
            return 'bad';
          }
          if (leanBodyMassRate === 77) {
            return 'average';
          }
          if (leanBodyMassRate >= 78) {
            return 'good';
          }
        } else {
          if (leanBodyMassRate < 85) {
            return 'bad';
          }
          if (leanBodyMassRate === 85) {
            return 'average';
          }
          if (leanBodyMassRate >= 86) {
            return 'good';
          }
        }
        return void 0;
      },
      calculateMuscularNeed: function(leanBodyMassRate, sex) {
        var idealLBMRate;
        if (rateLeanBodyMassRate(leanBodyMassRate, sex) === 'good') {
          return 0;
        }
        if (sex === 'f') {
          idealLBMRate = 78;
        } else {
          idealLBMRate = 86;
        }
        return (idealLBMRate - leanBodyMassRate) * weight / 100;
      },
      rateBodyFat: function(bodyFat, sex) {
        if (sex === 'f') {
          if (bodyFat <= 10) {
            return 'essential';
          }
          if (bodyFat > 10 && bodyFat <= 28) {
            return 'health';
          }
          if (bodyFat > 28 && bodyFat <= 35) {
            return 'risk';
          }
          if (bodyFat > 35) {
            return 'obesity';
          }
        } else {
          if (bodyFat <= 5) {
            return 'essential';
          }
          if (bodyFat > 5 && bodyFat <= 20) {
            return 'health';
          }
          if (bodyFat > 20 && bodyFat <= 25) {
            return 'risk';
          }
          if (bodyFat > 25) {
            return 'obesity';
          }
        }
      },
      calculateMonthsToTrain: function(exceedingFatKg, workoutsPerWeek, totalWorkoutCaloriesPerDay, caloriesToReduceOrInc) {
        return ((exceedingFat * 1000) * 9) / (workoutsPerWeek * 52.2 / 12) * (totalWorkoutCaloriesPerDay + caloriesToReduceOrInc);
      },
      calculateNumberOfWorkouts: function(workoutsPerWeek, monthsToTrain) {
        return (workoutsPerWeek * 52.2 / 12) * monthsToTrain;
      },
      suggestWeeklyCaloricExpenditure: function(weight) {
        return weight * 2000 / 70;
      },
      suggestDailyCaloricExpenditure: function(weight) {
        return this.suggestWeeklyCaloricExpenditure(weight) / 7;
      },
      suggestActivityCaloricExpenditure: function(weight) {
        return weight * 300 / 70;
      },
      calculateSessionDuration: function(vo2MaxML, intensity, type, weight, caloriesToSpend) {
        var calsMinute, met, rvo2, tgtVo2, vo2MaxPercent;
        rvo2 = vo2MaxML - 3.5;
        vo2MaxPercent = vo2MaxPercent = this.translateIntensityToVO2Max(intensity, type);
        tgtVo2 = vo2MaxML * vo2MaxPercent + 3.5;
        met = tgtVo2 / 3.5;
        calsMinute = (met * 3.5 * weight) / 200;
        calsMinute -= this.getCorrection(type, cals, vo2MaxPercent);
        return caloriesToSpend / calsMinute;
      }
    };
  });

}).call(this);
