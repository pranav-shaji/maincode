

// router.put("/okok", async (req, res) => {
//     const data = await user.findOneAndUpdate(
//       { email: req.body.Gmail },
//       { $set: { email: req.body.Gmail } },
//       { new: true }
//     );
//   });


router.post("/send-otp", async (req, res) => {
    console.log(req.body);
    let newOtp = otp();
    let result = await user.updateOne(
      { email: req.body.email },
      {
        $set: {
          otp: newOtp,
        },
      }
    );
  
    console.log(result);
  
    if (result.acknowledged) {
      try {
        let info = await transporter.sendMail({
          from: "pranavshaji2244@gmail.com", // sender address
          to: "videmel264@wousi.com", // list of receivers
          subject: "Hello ✔", // Subject line
          text: newOtp, // plain text body
          // html: "<h1>7894</h1>",
        });
  
        console.log(info);
  
        res.json("successfull");
      } catch (error) {
        console.log(error);
      }
    }
  });
  