## add kunjungan

### parameter
```
    URL : {BASE_URL}/pcare-rest-v3.0/kunjungan
    Ref_TACC : [
        { "kdTacc": "-1", "nmTacc": "Tanpa TACC", alasanTacc:[] },
        { "kdTacc": "1", "nmTacc": "Time", alasanTacc:["< 3 Hari", ">= 3 - 7 Hari", ">= 7 Hari"] },
        { "kdTacc": "2", "nmTacc": "Age", alasanTacc:["< 1 Bulan", ">= 1 Bulan s/d < 12 Bulan", ">= 1 Tahun s/d < 5 Tahun",">= 5 Tahun s/d < 12 Tahun", ">= 12 Tahun s/d < 55 Tahun", ">= 55 Tahun"]   },
        { "kdTacc": "3", "nmTacc": "Complication", alasanTacc:(format : kdDiagnosa + " - " + NamaDiagnosa, contoh : "A09 - Diarrhoea and gastroenteritis of presumed infectious origin")  },
        { "kdTacc": "4", "nmTacc": "Comorbidity", alasanTacc:["< 3 Hari", ">= 3 - 7 Hari", ">= 7 Hari"]  }
    ]
```
### contoh
contoh parameter rujukan hemodialisa:
```
    {
        "noKunjungan": null,
        "noKartu": "0000043678034",
        "tglDaftar": "13-08-2018",
        "kdPoli": null,
        "keluhan": "keluhan",
        "kdSadar": "01",
        "sistole": 0,
        "diastole": 0,
        "beratBadan": 0,
        "tinggiBadan": 0,
        "respRate": 0,
        "heartRate": 0,
        "terapi": "catatan",
        "kdStatusPulang": "4",
        "tglPulang": "19-05-2016",
        "kdDokter": "73229",
        "kdDiag1": "A01.0",
        "kdDiag2": null,
        "kdDiag3": null,
        "kdPoliRujukInternal": null,
        "rujukLanjut": {
            "tglEstRujuk":"02-10-2018",
            "kdppk": "0116R028",
            "subSpesialis": null,
            "khusus": {
                "kdKhusus": "HDL",
                "kdSubSpesialis": null,
                "catatan": "peserta sudah biasa hemodialisa"
            }
        },
        "kdTacc": 0,
        "alasanTacc": null
    }
```
contoh parameter rujukan spesialis: 
```
    {
        "noKunjungan": null,
        "noKartu": "0000043678034",
        "tglDaftar": "13-08-2018",
        "kdPoli": null,
        "keluhan": "keluhan",
        "kdSadar": "01",
        "sistole": 0,
        "diastole": 0,
        "beratBadan": 0,
        "tinggiBadan": 0,
        "respRate": 0,
        "heartRate": 0,
        "terapi": "catatan",
        "kdStatusPulang": "4",
        "tglPulang": "19-05-2016",
        "kdDokter": "73229",
        "kdDiag1": "A01.0",
        "kdDiag2": null,
        "kdDiag3": null,
        "kdPoliRujukInternal": null,
        "rujukLanjut": {
            "tglEstRujuk":"02-10-2018",
            "kdppk": "0116R028",
            "subSpesialis": {
                "kdSubSpesialis1": "3"
                "kdSarana": "4"
            },
            "khusus": null
        },
        "kdTacc": 0,
        "alasanTacc": null
    }
```

## add pendaftaran

### parameter
```
URL : {BASE_URL}/pcare-rest-v3.0/pendaftaran
 "tkp": [{ "kdTkp": "10", "nmTkp": "RJTP" }, { "kdTkp": "20", "nmTkp": "RITP" }, { "kdTkp": "50", "nmTkp": "Promotif" }]
```

### contoh
```
{
  "kdProviderPeserta": "0114A026",
  "tglDaftar": "12-08-2015",
  "noKartu": "0001113569638",
  "kdPoli": "001",
  "keluhan": null,
  "kunjSakit": true,
  "sistole": 0,
  "diastole": 0,
  "beratBadan": 0,
  "tinggiBadan": 0,
  "respRate": 0,
  "heartRate": 0,
  "rujukBalik": 0,
  "kdTkp": "10"
}
```

### response
```
"response": {
      "field": "noUrut",
      "message": "A1"
  },
  "metaData": {
      "message": "CREATED",
      "code": 201
  }
```


