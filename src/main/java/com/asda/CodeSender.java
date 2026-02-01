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
/**
 *
 * @author Marcela Tiemi Shinzato
 */
@jakarta.ws.rs.Path("/sendcode")
public class CodeSender {

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response receiveFile(@FormDataParam("file") InputStream fileInputStream,@FormDataParam("lang") String lang) throws IOException {
        // Save graph.gv temporarily
        Path tempPath = Files.createTempFile("graph", ".gv");
        Files.copy(fileInputStream, tempPath, StandardCopyOption.REPLACE_EXISTING);
        String boundary = "----JavaBoundary" + System.currentTimeMillis();
        URL url;
        // Build POST to container
        if("Java".equals(lang) ||"Python".equals(lang) || "R".equals(lang) || lang == null)
        {
            url = new URL("http://rjp_code:8000/process");
        }
        else
        {
            url = new URL("http://c_code:8002/process");
        }
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);

        try (DataOutputStream out = new DataOutputStream(conn.getOutputStream())) {
            out.writeBytes("--" + boundary + "\r\n");
            out.writeBytes("Content-Disposition: form-data; name=\"lang\"\r\n\r\n");
            out.writeBytes(lang + "\r\n");
            // header
            out.writeBytes("--" + boundary + "\r\n");
            out.writeBytes("Content-Disposition: form-data; name=\"file\"; filename=\"graph.gv\"\r\n");
            out.writeBytes("Content-Type: text/plain\r\n\r\n");
            Files.copy(tempPath, out); 
            // send content
            out.writeBytes("\r\n--" + boundary + "--\r\n");
            out.flush();
        }

        // 3. Read response from container (the code file)
        int status = conn.getResponseCode();
        if (status != 200) {
            return Response.status(Response.Status.BAD_GATEWAY).entity("Error when calling container").build();
        }

        InputStream respostaPython = conn.getInputStream();
        byte[] result = respostaPython.readAllBytes(); // code in bytes

        // 4. Return code as download
        return Response.ok(new ByteArrayInputStream(result))
                .type("text/x-python")
                .header("Content-Disposition", "attachment; filename=\"code.py\"")
                .build();
        }
        
    }

