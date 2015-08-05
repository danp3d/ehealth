angular.module 'ehealth'
    
    # Alert service
    .factory 'utilsSvc', ->
        # Get the age of a particular date in years
        getAgeYears: (dt, complete) ->
            years = new Date(Date.now() - dt.getTime()).getUTCFullYear() - 1970
            if complete
               years += (@getAgeMonths dt) / 12
               years += ((@getAgeDays dt) / 30) / 12
            
            return years
        
        # Get the age of a particular date in months (not counting full years)
        getAgeMonths: (dt) ->
            new Date(Date.now() - dt.getTime()).getUTCMonth()
            
        # Age in days (not counting years/months)
        getAgeDays: (dt) ->
            new Date(Date.now() - dt.getTime()).getUTCDate()            
        
        # Activity factor - number between 1.1 and 2.4 describing how active someoe is during the day (e.g. a builder will have a
        # bigger activity factor than a software developer
        translateActivityFactor: (factor) ->
            factor = parseFloat(factor)
            factor = 1.1 if not factor
            descr = factor.toFixed(1) + '. '
            
            descr += 'Muito leve' if factor > 1 and factor < 1.5
            descr += 'Leve' if factor > 1.4 and factor < 1.7
            descr += 'Moderada' if factor > 1.6 and factor < 2.1
            descr += 'Intensa' if factor > 2.0 and factor < 2.4
            descr += 'Muito Intensa' if factor >= 2.4
            
            return descr
            
        # Intensity -> VO2 Max
        translateIntensityToVO2Max: (intensity, type, dob) ->
            return (intensity / 100) if type == 'cardio'

            result = intensity
            intens = (intensity * 29 / 39) if intensity <= 39
            intens = ((intensity - 40) * 2.06 + 30) if intensity >= 40 and intensity <= 59
            intens = ((intensity - 60) * 0.53 + 70) if intensity >= 60 and intensity <= 79
            intens = intensity if intensity >= 80
            return intens / 100
            
        # Workout intensity (e.g. a walk in the park will be a light workout, but a proffessional rugby match will be heavy)
        translateWorkoutIntensity: (intensity, type) ->
            type = 'cardio' if not type
            intensity = parseInt(intensity)
            intensity = 0 if not intensity
            descr = intensity + '. '
            
            if type == 'cardio'
                descr += 'Nenhum esforço' if intensity == 0 
                descr += 'Extremamente leve' if intensity >= 1 and intensity <= 20
                descr += 'Leve' if intensity >= 21 and intensity <= 59
                descr += 'Moderado' if intensity >= 60 and intensity <= 69
                descr += 'Difícil' if intensity >= 70 and intensity <= 79
                descr += 'Muito difícil' if intensity >= 80 and intensity <= 89
                descr += 'Extremamente difícil' if intensity >= 90 and intensity <= 99
                descr += 'Exaustão' if intensity == 100
                descr += ' - Exercício regenerativo' if intensity >= 28 and intensity <= 42
                descr += ' - Perda de gordura' if intensity >= 43 and intensity <= 56
                descr += ' - Condicionamento aeróbico' if intensity >= 57 and intensity <= 70
                descr += ' - Limiar anaeróbico' if intensity >= 71 and intensity <= 83
                descr += ' - Esforço máximo' if intensity >= 84 and intensity <= 100
            else
                descr += 'Nenhum esforço' if intensity == 0 
                descr += 'Demasiado leve' if intensity >= 1 and intensity <= 19
                descr += 'Muito leve' if intensity >= 20 and intensity <= 29
                descr += 'Leve' if intensity >= 30 and intensity <= 39
                descr += 'Moderado' if intensity >= 40 and intensity <= 59
                descr += 'Pesado' if intensity >= 60 and intensity <= 79
                descr += 'Muito pesado' if intensity >= 80 and intensity <= 89
                descr += 'Extremamente pesado' if intensity >= 90 and intensity <= 100
                
            return descr
            
        # Get workout type name
        translateWorkoutType: (type) ->
            return 'Cardiovascular (aeróbico)' if type == 'cardio'
            return 'Força (anaeróbico)' if type == 'strength'
            
            return '';
            
        # VO2 liters to ml
        convertVO2MlToL: (vo2Ml, bodyWeight) ->
            vo2Ml * bodyWeight / 1000
            
        # Maximum Cardio Frequency
        getMaxCF: (age) ->
            cfMax = 220 - age
            difference = 10 if age <= 25
            differnece = 12 if age > 25
            
            cf = 
                from: (cfMax-difference)
                to: (cfMax+difference)
    
        # Maximum cardio frequency -> 
        convertMaxCFtoResCF: (maxCF, restCF) ->
            cf = 
                from: maxCF.from - restCF
                to: maxCF.to - restCF

        getWorkoutCF: (resCF, intensity, restCF) ->
            cf = 
                from: resCF.from * (intensity / 100) + restCF
                to: resCF.to * (intensity / 100) + restCF

        getCorrection: (type, cals, vo2MaxPercent) ->
            correction = 0 if type == 'cardio'
            if type == 'strength'
                if vo2MaxPercent > 0.45 
                    correction = cals * 0.06
                else if vo2MaxPercent <= 0.45 and vo2MaxPercent > 0.29
                    correction = cals * 0.25
                    
            return correction

        calculateCalories: (vo2L, intensity, workoutDuration, type) ->
            vo2MaxPercent = @translateIntensityToVO2Max intensity, type
            cals = vo2L * vo2MaxPercent * 5 * workoutDuration
            correction = @getCorrection type, cals, vo2MaxPercent
            return cals - correction
            
        calculateBasalMetabolicRate: (weight, height, dob, sex) ->
            if sex == 'f'
                bmr = 655.1 + (9.5 * weight) + (1.8 * height) - (4.7 * @getAgeYears(dob, true))
            else
                bmr = 66.5 + (13.8 * weight) + (5 * height) - (6.8 * @getAgeYears(dob, true))

            return bmr
            
        calculateDailyMetabolicRate: (basalMetabolicRate, activityFactor) ->
            return parseFloat(basalMetabolicRate * activityFactor).toFixed 3
            
        calculateTotalMetabolicRate: (dailyMetabolicRate, caloriesSpentWithWorkouts) ->
            return dailyMetabolicRate + caloriesSpentWithWorkouts
            
        getIdealBodyFatRate: () ->
            if sex == 'f'
                if age <= 25
                    return 19
                else if age <= 35
                    return 20
                else if age <= 45
                    return 23
                else if age <= 55
                    return 25
                else
                    return 26
            else
                if age <= 25
                    return 10
                else if age <= 35
                    return 15
                else if age <= 45
                    return 18
                else if age <= 55
                    return 20
                else
                    return 21
        
        rateBodyFatPerAge: (bodyFat, dob, sex) ->
            age = getAgeYears dob
            if sex == 'f'
                if age <= 25
                    return 'excellent' if bodyFat <= 16
                    return 'good' if bodyFat <= 19
                    return 'average+' if bodyFat <= 22
                    return 'average' if bodyFat <= 25
                    return 'average-' if bodyFat <= 28
                    return 'bad' if bodyFat <= 31
                    return 'worse'
                else if age <= 35
                    return 'excellent' if bodyFat <= 16
                    return 'good' if bodyFat <= 20
                    return 'average+' if bodyFat <= 23
                    return 'average' if bodyFat <= 25
                    return 'average-' if bodyFat <= 29
                    return 'bad' if bodyFat <= 33
                    return 'worse'
                else if age <= 45
                    return 'excellent' if bodyFat <= 19
                    return 'good' if bodyFat <= 23
                    return 'average+' if bodyFat <= 26
                    return 'average' if bodyFat <= 29
                    return 'average-' if bodyFat <= 32
                    return 'bad' if bodyFat <= 36
                    return 'worse'
                else if age <= 55
                    return 'excellent' if bodyFat <= 21
                    return 'good' if bodyFat <= 25
                    return 'average+' if bodyFat <= 28
                    return 'average' if bodyFat <= 31
                    return 'average-' if bodyFat <= 34
                    return 'bad' if bodyFat <= 38
                    return 'worse'
                else
                    return 'excellent' if bodyFat <= 22
                    return 'good' if bodyFat <= 26
                    return 'average+' if bodyFat <= 29
                    return 'average' if bodyFat <= 32
                    return 'average-' if bodyFat <= 35
                    return 'bad' if bodyFat <= 38
                    return 'worse'
            else
                if age <= 25
                    return 'excellent' if bodyFat <= 6
                    return 'good' if bodyFat <= 10
                    return 'average+' if bodyFat <= 13
                    return 'average' if bodyFat <= 16
                    return 'average-' if bodyFat <= 20
                    return 'bad' if bodyFat <= 24
                    return 'worse'
                else if age <= 35
                    return 'excellent' if bodyFat <= 11
                    return 'good' if bodyFat <= 15
                    return 'average+' if bodyFat <= 18
                    return 'average' if bodyFat <= 20
                    return 'average-' if bodyFat <= 24
                    return 'bad' if bodyFat <= 28
                    return 'worse'
                else if age <= 45
                    return 'excellent' if bodyFat <= 14
                    return 'good' if bodyFat <= 18
                    return 'average+' if bodyFat <= 21
                    return 'average' if bodyFat <= 23
                    return 'average-' if bodyFat <= 25
                    return 'bad' if bodyFat <= 29
                    return 'worse'
                else if age <= 55
                    return 'excellent' if bodyFat <= 16
                    return 'good' if bodyFat <= 20
                    return 'average+' if bodyFat <= 23
                    return 'average' if bodyFat <= 25
                    return 'average-' if bodyFat <= 27
                    return 'bad' if bodyFat <= 30
                    return 'worse'
                else
                    return 'excellent' if bodyFat <= 18
                    return 'good' if bodyFat <= 21
                    return 'average+' if bodyFat <= 23
                    return 'average' if bodyFat <= 25
                    return 'average-' if bodyFat <= 27
                    return 'bad' if bodyFat <= 30
                    return 'worse'
            
        calculateLeanMass: (weight, bodyFat) ->
            return ((100 - bodyFat) / 100) * weight
            
        calculateMaxGainRate: (leanMass, experienced) ->
            experienced = !!experienced
            magicVal = if experienced then 268 else 148
            rate = leanMass / magicVal
            remain = rate % 100
            gint = Math.round(rate)
            remain = rate - gint
            suff = Math.round(remain * 100)
            rate = gint + suff / 100
            return parseFloat(rate).toFixed 3
            
        calculateOptimalNutrientIngestionForMassGain: (leanMass, maxGainRate, activityFactor) ->
            gainrateCals = 1.15 * ((maxGainRate * 453 / 7) * 1.63 + ((maxGainRate * 454 / 7) / 3) * 7.91)
            gaincals = Math.round(((370 + (9.8 * leanMass)) * activityFactor) + gainrateCals)
            proteins = Math.round(0.907 * leanMass)
            fat = Math.round(0.3 * gaincals / 9)
            carbs = Math.round((gaincals - 0.3 * gaincals - 4 * proteins) / 4)
            
            toReturn = 
                "calories": parseFloat(gaincals).toFixed 3
                "proteins": parseFloat(proteins).toFixed 3
                "fat": parseFloat(fat).toFixed 3
                "carbs": parseFloat(carbs).toFixed 3
                
            return toReturn
        
        calculateBodyFatKg: (weight, bodyFat) ->
            return (bodyFat / 100) * weight
            
        calculateIdealWeight: (leanBodyMass, idealBodyFat) ->
            return leanBodyMass / (1 - (idealBodyFat / 100))
        
        calculateExceedingFatkg: (bodyFat, idealBodyFat, weight) ->
            return ((bodyFat - idealBodyFat) * weight) / 100
        
        calculateLeanBodyMassRate: (bodyFat, weight) ->
            return (100 - bodyFat) / 100 * weight
        
        calculateLeanBodyMass: (leanBodyMassRate, weight) ->
            return (leanBodyMassRate / 100) * weight
        
        rateLeanBodyMassRate: (leanBodyMassRate, sex) ->
            if sex == 'f'
                return 'bad' if leanBodyMassRate < 77
                return 'average' if leanBodyMassRate == 77
                return 'good' if leanBodyMassRate >= 78
            else
                return 'bad' if leanBodyMassRate < 85
                return 'average' if leanBodyMassRate == 85
                return 'good' if leanBodyMassRate >= 86
                
            return undefined
        
        calculateMuscularNeed: (leanBodyMassRate, sex) ->
            return 0 if rateLeanBodyMassRate(leanBodyMassRate, sex) == 'good'
        
            if sex == 'f'
                idealLBMRate = 78
            else
                idealLBMRate = 86
                
            return (idealLBMRate - leanBodyMassRate) * weight / 100
            
        rateBodyFat: (bodyFat, sex) ->
            if sex == 'f'
                return 'essential' if bodyFat <= 10
                return 'health' if bodyFat > 10 and bodyFat <= 28
                return 'risk' if bodyFat > 28 and bodyFat <= 35
                return 'obesity' if bodyFat > 35
            else
                return 'essential' if bodyFat <= 5
                return 'health' if bodyFat > 5 and bodyFat <= 20
                return 'risk' if bodyFat > 20 and bodyFat <= 25
                return 'obesity' if bodyFat > 25        
                
        calculateMonthsToTrain: (exceedingFatKg, workoutsPerWeek, totalWorkoutCaloriesPerDay, caloriesToReduceOrInc) ->
            ((exceedingFat * 1000) * 9) / (workoutsPerWeek * 52.2 / 12) * (totalWorkoutCaloriesPerDay + caloriesToReduceOrInc)
            
        calculateNumberOfWorkouts: (workoutsPerWeek, monthsToTrain) ->
            (workoutsPerWeek * 52.2 / 12) * monthsToTrain
            
        suggestWeeklyCaloricExpenditure: (weight) ->
            return weight * 2000 / 70
            
        suggestDailyCaloricExpenditure: (weight) ->
            return @suggestWeeklyCaloricExpenditure(weight) / 7
            
        suggestActivityCaloricExpenditure: (weight) ->
            return weight * 300 / 70
            
        calculateSessionDuration: (vo2MaxML, intensity, type, weight, caloriesToSpend) ->
            rvo2 = vo2MaxML - 3.5
            vo2MaxPercent = vo2MaxPercent = @translateIntensityToVO2Max intensity, type
            tgtVo2 = vo2MaxML * vo2MaxPercent + 3.5
            met = tgtVo2 / 3.5
            calsMinute = (met * 3.5 * weight) / 200
            calsMinute -= @getCorrection type, cals, vo2MaxPercent
            
            return caloriesToSpend / calsMinute
        
        