<?php
function curlFetch($url, $cookie = "", $referer = "", $data = null){
        $ch = curl_init($url);
        $headers_org = array("Cookie:$cookie","Host:www.cjcp.com.cn");  //格式：array('Host:s1.dwstatic.com','Cookie:uin=o1292100530; skey=@JRTpRuqFt')
        $user_agent = "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.60 Safari/537.1";  

        curl_setopt($ch,CURLOPT_HTTPHEADER, $headers_org); //设置请求头  
        curl_setopt($ch,CURLOPT_USERAGENT, $user_agent);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // 返回字符串，而非直接输出
        curl_setopt($ch, CURLOPT_HEADER, false);   // 不返回header部分
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 120);   // 设置socket连接超时时间
        if (!empty($referer))
        {
            curl_setopt($ch, CURLOPT_REFERER, $referer);   // 设置引用网址
        }

        if (is_null($data))
        {
            // GET
        }
        else if (is_string($data))
        {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
            // POST
        }
        else if (is_array($data))
        {
            // POST
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        }
        set_time_limit(120); // 设置自己服务器超时时间
        $str = curl_exec($ch);
        curl_close($ch);
        return $str;
}

function getDataByIssue($issue){
    $data=curlFetch("http://www.cjcp.com.cn/ajax_kj.php?jsoncallback=&ssq_qs=$issue");
        $data=str_replace(array('("','")'),'',$data);
        //issue：期次，tdate：日期，totalmoney：本期销售量,num1-7:中奖号码,p1-6:1-6等奖中奖注数，money1-2：一二等奖中奖金额
        list($issue,$tdate,$totalmoney,$num1,$num2,$num3,$num4,$num5,$num6,$num7,$p1,$p2,$p3,$p4,$p5,$p6,$poolmoney,$money1,$money2)=explode('*',$data);
        $savedata=array('issue'=>$issue,
                        'issuestr'=>$issue,
                        'tdate'=>$tdate,
                        'totalmoney'=>$totalmoney,
                        'num1'=>$num1,
                        'num2'=>$num2,
                        'num3'=>$num3,
                        'num4'=>$num4,
                        'num5'=>$num5,
                        'num6'=>$num6,
                        'num7'=>$num7,
                        'numstr'=>$num1.','.$num2.','.$num3.','.$num4.','.$num5.','.$num6.','.$num7,
                        'p1'=>$p1,
                        'p2'=>$p2,
                        'p3'=>$p3,
                        'p4'=>$p4,
                        'p5'=>$p5,
                        'p6'=>$p6,
                        'poolmoney'=>$poolmoney,
                        'money1'=>$money1,
                        'money2'=>$money2,
                        );
        return $savedata;
}
