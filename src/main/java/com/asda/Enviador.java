package com.asda;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.glassfish.jersey.media.multipart.FormDataParam;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@jakarta.ws.rs.Path("/enviar")
public class Enviador {

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response receberArquivo(@FormDataParam("arquivo")  InputStream fileInputStream,@FormDataParam("lang") String lang) throws IOException {
        // 1. Salva temporariamente o graph.gv
        Path tempPath = Files.createTempFile("graph", ".gv");
        Files.copy(fileInputStream, tempPath, StandardCopyOption.REPLACE_EXISTING);
        String boundary = "----JavaBoundary" + System.currentTimeMillis();
        URL url;
        if("Java".equals(lang) ||"Python".equals(lang) || "R".equals(lang) || lang==null)
        {// 2. Constrói POST para o container Python
            url = new URL("http://rjp_code:8000/processar");
        }
        else
        {
            System.out.println("lang = C"); 
            url = new URL("http://c_code:8002/processar");
        }
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);

        try (DataOutputStream out = new DataOutputStream(conn.getOutputStream())) {
            out.writeBytes("--" + boundary + "\r\n");
            out.writeBytes("Content-Disposition: form-data; name=\"lang\"\r\n\r\n");
            out.writeBytes(lang + "\r\n");
            // Cabeçalho da parte do arquivo
            out.writeBytes("--" + boundary + "\r\n");
            out.writeBytes("Content-Disposition: form-data; name=\"arquivo\"; filename=\"graph.gv\"\r\n");
            out.writeBytes("Content-Type: text/plain\r\n\r\n");
            Files.copy(tempPath, out); // envia o conteúdo
            out.writeBytes("\r\n--" + boundary + "--\r\n");
            out.flush();
        }

        // 3. Lê resposta do container Python (o arquivo codigo.py)
        int status = conn.getResponseCode();
        if (status != 200) {
            return Response.status(Response.Status.BAD_GATEWAY).entity("Error when calling container").build();
        }

        InputStream respostaPython = conn.getInputStream();
        byte[] resultado = respostaPython.readAllBytes(); // código em bytes

        // 4. Retorna o código como download
        return Response.ok(new ByteArrayInputStream(resultado))
                .type("text/x-python")
                .header("Content-Disposition", "attachment; filename=\"codigo.py\"")
                .build();
        }
        
    }

