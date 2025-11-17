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

@jakarta.ws.rs.Path("/executar")
public class Executor {

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response receberArquivo(@FormDataParam("arquivo") InputStream fileInputStream,@FormDataParam("lang") String lang) throws IOException {
        // 1. Salva temporariamente o graph.gv
        Path tempPath;
        switch (lang) {
            case "R":
                tempPath = Files.createTempFile("code", ".r");
                break;
            case "Java":
                tempPath = Files.createTempFile("code", ".zip");
                break;
            case "C SMPL":
                tempPath = Files.createTempFile("code", ".c");
                break;
            case "C SMPLX":
                tempPath = Files.createTempFile("code", ".c");
                break;
            default:
                tempPath = Files.createTempFile("code", ".py");
                break;
        }
        //System.out.println(new String(fileInputStream.readAllBytes(), StandardCharsets.UTF_8));
        Files.copy(fileInputStream, tempPath, StandardCopyOption.REPLACE_EXISTING);

        // 2. Constrói POST para o container Python
        String boundary = "----JavaBoundary" + System.currentTimeMillis();
        URL url = new URL("http://helloworldweb-python-executor-1:8000/executar");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);
        conn.setConnectTimeout(5000); // até 5 segundos para conectar
        conn.setReadTimeout(20000);   // até 20 segundos aguardando resposta

        try (DataOutputStream out = new DataOutputStream(conn.getOutputStream())) {
            out.writeBytes("--" + boundary + "\r\n");
            out.writeBytes("Content-Disposition: form-data; name=\"lang\"\r\n\r\n");
            out.writeBytes(lang + "\r\n");
            // Cabeçalho da parte do arquivo
            out.writeBytes("--" + boundary + "\r\n");
            switch (lang) {
            case "R":
                out.writeBytes("Content-Disposition: form-data; name=\"arquivo\"; filename=\"code.r\"\r\n");
                break;
            case "Java":
                out.writeBytes("Content-Disposition: form-data; name=\"arquivo\"; filename=\"code.zip\"\r\n");
                break;
            case "C SMPL":
                out.writeBytes("Content-Disposition: form-data; name=\"arquivo\"; filename=\"code.c\"\r\n");
                break;
            case "C SMPLX":
                out.writeBytes("Content-Disposition: form-data; name=\"arquivo\"; filename=\"code.c\"\r\n");
                break;
            default:
                out.writeBytes("Content-Disposition: form-data; name=\"arquivo\"; filename=\"code.py\"\r\n");
                break;
        }       
            out.writeBytes("Content-Type: application/zip\r\n\r\n");
            Files.copy(tempPath, out); // envia o conteúdo
            out.writeBytes("\r\n--" + boundary + "--\r\n");
            out.flush();
        }

        try {
            int status = conn.getResponseCode();
            if (status != 200) {
                return Response.status(Response.Status.BAD_GATEWAY)
                        .entity("Error when calling container")
                        .build();
            }

            try (InputStream respostaPython = conn.getInputStream()) {
                byte[] resultado = respostaPython.readAllBytes();
                return Response.ok(new ByteArrayInputStream(resultado))
                        .type("text/x-python")
                        .header("Content-Disposition", "attachment; filename=\"report.txt\"")
                        .build();
            }

        } catch (java.net.SocketTimeoutException e) {
            return Response.status(Response.Status.GATEWAY_TIMEOUT)
                    .entity("Execution timed out")
                    .build();
        }

    }
}

