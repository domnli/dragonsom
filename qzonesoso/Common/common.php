<?php
function curlFetch($url, $cookie = "", $referer = "", $data = null){
        $ch = curl_init($url);
        $headers_org = array("Cookie:$cookie","Host:g.qzone.qq.com");  //格式：array('Host:s1.dwstatic.com','Cookie:uin=o1292100530; skey=@JRTpRuqFt')
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