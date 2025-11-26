
// const Rental = require('../models/Rental');
// const RentalBooking = require('../models/RentalBooking');
// const sendEmail = require('../utils/sendEmail');

// // 1. Add a new Rental Item (Existing)
// exports.createRental = async (req, res) => {
//   try {
//     console.log("Authenticated User:", req.user); 

//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ message: "Authentication failed. User ID missing." });
//     }

//     let imagePath = 'https://via.placeholder.com/150';
//     if (req.file && req.file.path) imagePath = req.file.path;

//     const newRental = new Rental({
//       name: req.body.name,
//       category: req.body.category,
//       description: req.body.description,
//       pricePerHour: req.body.pricePerHour,
//       location: req.body.location,
//       image: imagePath,
//       owner: req.user._id 
//     });

//     const savedRental = await newRental.save();
//     res.status(201).json(savedRental);

//   } catch (error) {
//     console.error("Error in createRental:", error);
//     res.status(500).json({ message: 'Server Error', error: error.message });
//   }
// };

// // 2. Get All Rental Items (Existing)
// exports.getAllRentals = async (req, res) => {
//   try {
//     const rentals = await Rental.find().populate('owner', 'name location');
//     res.status(200).json(rentals);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching rentals', error });
//   }
// };

// // 3. Book Rental (Existing)
// exports.bookRental = async (req, res) => {
//   try {
//     const { rentalId, startDate, endDate, totalPrice, ownerId } = req.body;

//     if (!rentalId || !ownerId) {
//       return res.status(400).json({ message: "Rental ID and Owner ID are required" });
//     }

//     const rentalItem = await Rental.findById(rentalId);
//     if (!rentalItem) {
//       return res.status(404).json({ message: "Machine not found" });
//     }

//     if (rentalItem.available === false) {
//       return res.status(400).json({ 
//         message: `Booking Failed: Machine is unavailable. (${rentalItem.unavailabilityReason || 'Stopped'})` 
//       });
//     }

//     let finalPrice = totalPrice;
    
//     if (!finalPrice || finalPrice === 0) {
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       const diffHours = Math.abs(end - start) / 36e5; 
//       finalPrice = Math.ceil(diffHours * rentalItem.pricePerHour);
//     }

//     if (isNaN(finalPrice)) finalPrice = 0;

//     const newBooking = new RentalBooking({
//       rental: rentalId,     
//       renter: req.user._id,     
//       owner: ownerId,
//       startDate,
//       endDate,
//       totalPrice: finalPrice,  
//       status: 'Pending'
//     });

//     await newBooking.save();
//     res.status(201).json({ message: "Booking Request Sent Successfully!", booking: newBooking });

//   } catch (error) {
//     console.error("Booking Error:", error);
//     res.status(500).json({ message: "Booking Failed", error: error.message });
//   }
// };

// // 4. Get My Listings (Existing)
// exports.getMyListings = async (req, res) => {
//   try {
//     const listings = await Rental.find({ owner: req.user._id });
//     res.status(200).json(listings);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching listings', error });
//   }
// };

// // 5. Get My Bookings (Existing)
// exports.getMyBookings = async (req, res) => {
//   try {
//     const bookings = await RentalBooking.find({ renter: req.user._id })
//       .populate('rental', 'name image pricePerHour location')
//       .sort({ createdAt: -1 });
//     res.status(200).json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching bookings', error });
//   }
// };

// // 6. Get Incoming Requests (Existing)
// exports.getIncomingRequests = async (req, res) => {
//   try {
//     const myRentals = await Rental.find({ owner: req.user._id });
    
//     if (!myRentals.length) {
//       return res.status(200).json([]);
//     }

//     const rentalIds = myRentals.map(item => item._id);

//     const requests = await RentalBooking.find({ rental: { $in: rentalIds } })
//       .populate('renter', 'name email')
//       .populate('rental', 'name image pricePerHour')
//       .sort({ createdAt: -1 });

//     res.status(200).json(requests);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error fetching requests', error });
//   }
// };

// // 7. ✅ UPDATE RENTAL STATUS (UPDATED WITH MAPS, PAYMENT & DOCS EMAIL)
// exports.updateRentalStatus = async (req, res) => {
//   // 'pickupLocation' comes from the frontend modal
//   const { bookingId, status, rejectionReason, pickupLocation } = req.body;

//   try {
//     const booking = await RentalBooking.findById(bookingId)
//       .populate({
//         path: 'rental',
//         populate: { path: 'owner', select: 'name email phone mobile location' } 
//       })
//       .populate('renter', 'name email');

//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     if (booking.rental.owner._id.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }

//     // 1. Update DB Status
//     booking.status = status;
//     if (status === 'Cancelled' && rejectionReason) {
//       booking.rejectionReason = rejectionReason;
//     }
//     // Note: If you want to save 'pickupLocation' in DB, add a field in Model first. 
//     // For now, we just send it in Email.
//     await booking.save();


//     // --- EMAIL LOGIC START ---
//     const renter = booking.renter;
//     const owner = booking.rental.owner;

//     // CASE A: BOOKING APPROVED (Detailed Green Email)
//     if (status === 'Confirmed') {
//       try {
//         const ownerPhone = owner.phone || owner.mobile || 'Not Available';
        
//         // Generate Google Maps Link
//         const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pickupLocation || owner.location || '')}`;

//         const message = `
//           <!DOCTYPE html>
//           <html>
//           <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0fdf4; margin: 0; padding: 0;">
//             <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #bbf7d0;">
              
//               <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 35px 20px; text-align: center;">
//                 <h1 style="color: #ffffff; margin: 0; font-size: 26px;">🎉 Booking Approved!</h1>
//                 <p style="color: #dcfce7; margin-top: 8px; font-size: 16px;">Get ready to pick up <strong>${booking.rental.name}</strong></p>
//               </div>

//               <div style="padding: 30px;">
//                 <p style="color: #374151; font-size: 16px; line-height: 1.6;">
//                   Dear <strong>${renter.name}</strong>,<br>
//                   The owner has accepted your request. Here are the important details for pickup.
//                 </p>

//                 <div style="background-color: #f9fafb; border-left: 5px solid #16a34a; padding: 20px; margin: 20px 0; border-radius: 4px;">
//                   <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 18px;">📋 Booking Summary</h3>
//                   <p style="margin: 5px 0; color: #4b5563;"><strong>Total to Pay:</strong> <span style="color: #dc2626; font-size: 18px;">₹${booking.totalPrice}</span> (Cash/UPI)</p>
//                   <p style="margin: 5px 0; color: #4b5563;"><strong>Start:</strong> ${new Date(booking.startDate).toLocaleString()}</p>
//                   <p style="margin: 5px 0; color: #4b5563;"><strong>End:</strong> ${new Date(booking.endDate).toLocaleString()}</p>
//                 </div>

//                 <div style="margin: 25px 0;">
//                   <h3 style="color: #111827; font-size: 18px; margin-bottom: 10px;">📍 Pickup Location</h3>
//                   <p style="background-color: #fff7ed; color: #9a3412; padding: 15px; border-radius: 8px; border: 1px dashed #fdba74; margin-top: 0;">
//                     ${pickupLocation || owner.location || "Contact Owner for Address"}
//                   </p>
                  
//                   <div style="text-align: center; margin-top: 15px;">
//                     <a href="${mapLink}" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
//                       🗺️ Open in Google Maps
//                     </a>
//                   </div>
//                 </div>

//                 <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 25px 0;">

//                 <div>
//                   <h3 style="color: #111827; font-size: 18px; margin-bottom: 10px;">🆔 Required Documents</h3>
//                   <ul style="color: #374151; padding-left: 20px; line-height: 1.6;">
//                     <li>Original <strong>Aadhar Card</strong> (for verification)</li>
//                     <li>Original <strong>PAN Card</strong> (if asked)</li>
//                     <li>Valid <strong>Driving License</strong> (for Tractor)</li>
//                   </ul>
//                 </div>

//                 <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 25px 0;">

//                 <div style="text-align: center;">
//                   <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">Have questions? Call the owner directly.</p>
//                   <a href="tel:${ownerPhone}" style="background-color: #111827; color: #ffffff; padding: 10px 20px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px;">
//                     📞 Call ${owner.name}: ${ownerPhone}
//                   </a>
//                 </div>

//               </div>
              
//               <div style="background-color: #f0fdf4; padding: 15px; text-align: center; color: #166534; font-size: 12px;">
//                 <p>Please inspect the machine before taking it.</p>
//                 <p>&copy; Farmio Rentals</p>
//               </div>
//             </div>
//           </body>
//           </html>
//         `;

//         await sendEmail({
//           email: renter.email,
//           subject: '✅ Action Required: Pickup Your Rental Machine',
//           message: message
//         });
//         console.log("✅ Approval Email sent to " + renter.email);

//       } catch (emailError) { console.error("❌ Email Failed:", emailError.message); }
//     } 
    
//     // CASE B: BOOKING REJECTED (Same as before)
//     else if (status === 'Cancelled') {
//       try {
//         const reasonText = rejectionReason || 'No specific reason provided.';
//         const message = `
//           <!DOCTYPE html>
//           <html>
//           <body style="font-family: sans-serif; background-color: #fef2f2; padding: 20px;">
//             <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 10px; border: 1px solid #fecaca;">
//               <h2 style="color: #b91c1c; text-align: center;">❌ Booking Declined</h2>
//               <p>Hello <strong>${renter.name}</strong>,</p>
//               <p>The owner has declined your request for <strong>${booking.rental.name}</strong>.</p>
              
//               <div style="background-color: #fff5f5; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
//                 <strong>Reason:</strong> ${reasonText}
//               </div>
              
//               <p style="text-align: center;">
//                 <a href="${process.env.FRONTEND_URL}/rental" style="color: #2563eb;">Browse other machines</a>
//               </p>
//             </div>
//           </body>
//           </html>
//         `;

//         await sendEmail({
//           email: renter.email,
//           subject: '⚠️ Booking Request Update',
//           message: message
//         });
//         console.log("✅ Rejection Email sent to " + renter.email);

//       } catch (emailError) { console.error("❌ Email Failed:", emailError.message); }
//     }

//     res.status(200).json({ message: `Booking ${status}`, booking });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error updating status', error });
//   }
// };

// // 8. Delete Rental (Existing)
// exports.deleteRental = async (req, res) => {
//   try {
//     const Rental = require('../models/Rental');
//     const { id } = req.params;

//     const rental = await Rental.findById(id);
//     if (!rental) return res.status(404).json({ message: "Machine not found" });

//     if (rental.owner.toString() !== req.user.id) {
//       return res.status(401).json({ message: "Not authorized" });
//     }

//     await Rental.findByIdAndDelete(id);
//     res.status(200).json({ message: "Machine deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// // 9. Toggle Availability (Existing)
// exports.toggleRentalAvailability = async (req, res) => {
//   try {
//     const Rental = require('../models/Rental');
//     const { id } = req.params;
//     const { reason } = req.body;

//     const rental = await Rental.findById(id);
//     if (!rental) return res.status(404).json({ message: "Machine not found" });

//     if (rental.owner.toString() !== req.user.id) {
//       return res.status(401).json({ message: "Not authorized" });
//     }

//     if (rental.available) {
//       rental.available = false;
//       rental.unavailabilityReason = reason || "Not specified";
//     } else {
//       rental.available = true;
//       rental.unavailabilityReason = "";
//     }

//     await rental.save();
//     res.status(200).json(rental);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };




const Rental = require('../models/Rental');
const RentalBooking = require('../models/RentalBooking');
const sendEmail = require('../utils/sendEmail');

// 1. Add a new Rental Item (Existing)
exports.createRental = async (req, res) => {
  try {
    console.log("Authenticated User:", req.user); 

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Authentication failed. User ID missing." });
    }

    let imagePath = 'https://via.placeholder.com/150';
    if (req.file && req.file.path) imagePath = req.file.path;

    const newRental = new Rental({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      pricePerHour: req.body.pricePerHour,
      location: req.body.location,
      image: imagePath,
      owner: req.user._id 
    });

    const savedRental = await newRental.save();
    res.status(201).json(savedRental);

  } catch (error) {
    console.error("Error in createRental:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// 2. Get All Rental Items (Existing)
exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find().populate('owner', 'name location');
    res.status(200).json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rentals', error });
  }
};

// 3. Book Rental (Existing)
exports.bookRental = async (req, res) => {
  try {
    const { rentalId, startDate, endDate, totalPrice, ownerId } = req.body;

    if (!rentalId || !ownerId) {
      return res.status(400).json({ message: "Rental ID and Owner ID are required" });
    }

    const rentalItem = await Rental.findById(rentalId);
    if (!rentalItem) {
      return res.status(404).json({ message: "Machine not found" });
    }

    if (rentalItem.available === false) {
      return res.status(400).json({ 
        message: `Booking Failed: Machine is unavailable. (${rentalItem.unavailabilityReason || 'Stopped'})` 
      });
    }

    let finalPrice = totalPrice;
    
    if (!finalPrice || finalPrice === 0) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffHours = Math.abs(end - start) / 36e5; 
      finalPrice = Math.ceil(diffHours * rentalItem.pricePerHour);
    }

    if (isNaN(finalPrice)) finalPrice = 0;

    const newBooking = new RentalBooking({
      rental: rentalId,     
      renter: req.user._id,     
      owner: ownerId,
      startDate,
      endDate,
      totalPrice: finalPrice,  
      status: 'Pending'
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking Request Sent Successfully!", booking: newBooking });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Booking Failed", error: error.message });
  }
};

// 4. Get My Listings (Existing)
exports.getMyListings = async (req, res) => {
  try {
    const listings = await Rental.find({ owner: req.user._id });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listings', error });
  }
};

// 5. Get My Bookings (Existing)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await RentalBooking.find({ renter: req.user._id })
      .populate('rental', 'name image pricePerHour location')
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error });
  }
};

// 6. Get Incoming Requests (Existing)
exports.getIncomingRequests = async (req, res) => {
  try {
    const myRentals = await Rental.find({ owner: req.user._id });
    
    if (!myRentals.length) {
      return res.status(200).json([]);
    }

    const rentalIds = myRentals.map(item => item._id);

    const requests = await RentalBooking.find({ rental: { $in: rentalIds } })
      .populate('renter', 'name email')
      .populate('rental', 'name image pricePerHour')
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching requests', error });
  }
};

// 7. ✅ UPDATE RENTAL STATUS (UPDATED LOGIC)
exports.updateRentalStatus = async (req, res) => {
  // 'pickupLocation' and 'isLicenseRequired' come from frontend modal
  const { bookingId, status, rejectionReason, pickupLocation, isLicenseRequired } = req.body;

  try {
    const booking = await RentalBooking.findById(bookingId)
      .populate({
        path: 'rental',
        populate: { path: 'owner', select: 'name email phone mobile location' } 
      })
      .populate('renter', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.rental.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // 1. Update DB Status
    booking.status = status;
    if (status === 'Cancelled' && rejectionReason) {
      booking.rejectionReason = rejectionReason;
    }
    await booking.save();


    // --- EMAIL LOGIC START ---
    const renter = booking.renter;
    const owner = booking.rental.owner;

    // CASE A: BOOKING APPROVED (Detailed Green Email)
    if (status === 'Confirmed') {
      try {
        const ownerPhone = owner.phone || owner.mobile || 'Not Available';
        
        // Generate Smart Map Link
        let mapUrl = "";
        if (pickupLocation && pickupLocation.includes("http")) {
           const urlRegex = /(https?:\/\/[^\s]+)/g;
           const match = pickupLocation.match(urlRegex);
           mapUrl = match ? match[0] : `http://googleusercontent.com/maps.google.com/maps?q=${encodeURIComponent(pickupLocation)}`;
        } else {
           mapUrl = `http://googleusercontent.com/maps.google.com/maps?q=${encodeURIComponent(pickupLocation || owner.location || '')}`;
        }

        // License HTML Logic
        const licenseHtml = isLicenseRequired 
          ? `<li style="color: #dc2626; font-weight: bold; background: #fee2e2; padding: 5px; border-radius: 4px;">🚗 Valid Driving License (REQUIRED)</li>`
          : `<li style="color: #374151;">🚗 Driving License (Not Mandatory)</li>`;

        const message = `
          <!DOCTYPE html>
          <html>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0fdf4; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #bbf7d0;">
              
              <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 35px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 26px;">🎉 Booking Approved!</h1>
                <p style="color: #dcfce7; margin-top: 8px; font-size: 16px;">Get ready to pick up <strong>${booking.rental.name}</strong></p>
              </div>

              <div style="padding: 30px;">
                <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                  Dear <strong>${renter.name}</strong>,<br>
                  The owner has accepted your request. Here are the important details for pickup.
                </p>

                <div style="background-color: #f9fafb; border-left: 5px solid #16a34a; padding: 20px; margin: 20px 0; border-radius: 4px;">
                  <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 18px;">📋 Booking Summary</h3>
                  <p style="margin: 5px 0; color: #4b5563;"><strong>Total to Pay:</strong> <span style="color: #dc2626; font-size: 18px;">₹${booking.totalPrice}</span> (Cash/UPI)</p>
                  <p style="margin: 5px 0; color: #4b5563;"><strong>Start:</strong> ${new Date(booking.startDate).toLocaleString()}</p>
                  <p style="margin: 5px 0; color: #4b5563;"><strong>End:</strong> ${new Date(booking.endDate).toLocaleString()}</p>
                </div>

                <div style="margin: 25px 0; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                  
                  <div style="background-color: #e0f2fe; height: 100px; width: 100%; display: flex; align-items: center; justify-content: center; background-image: url('https://www.transparenttextures.com/patterns/diagmonds-light.png');">
                    <div style="background: #ffffff; height: 50px; width: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                      <span style="font-size: 24px;">📍</span>
                    </div>
                  </div>

                  <div style="padding: 20px; background-color: #ffffff;">
                    <p style="margin: 0; font-size: 11px; color: #9ca3af; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">PICKUP ADDRESS</p>
                    
                    <p style="margin: 10px 0 20px 0; font-size: 16px; color: #1f2937; font-weight: 500; line-height: 1.5;">
                      ${pickupLocation || owner.location || "Contact Owner for Address"}
                    </p>

                    <a href="${mapUrl}" target="_blank" style="display: block; width: 100%; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 0; border-radius: 8px; text-align: center; font-weight: bold; font-size: 14px;">
                      🚗 Navigate with Google Maps
                    </a>
                  </div>
                </div>

                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 25px 0;">

                <div>
                  <h3 style="color: #111827; font-size: 18px; margin-bottom: 10px;">🆔 Required Documents</h3>
                  <ul style="color: #374151; padding-left: 20px; line-height: 1.8;">
                    <li>Original <strong>Aadhar Card</strong> (Verification)</li>
                    ${licenseHtml} <li>Payment Amount (Cash/UPI)</li>
                  </ul>
                </div>

                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 25px 0;">

                <div style="text-align: center;">
                  <a href="tel:${ownerPhone}" style="background-color: #111827; color: #ffffff; padding: 10px 20px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px;">
                    📞 Call Owner: ${ownerPhone}
                  </a>
                </div>

              </div>
              
              <div style="background-color: #f0fdf4; padding: 15px; text-align: center; color: #166534; font-size: 12px;">
                <p>Please inspect the machine before taking it.</p>
                <p>© Farmio Rentals</p>
              </div>
            </div>
          </body>
          </html>
        `;

        await sendEmail({
          email: renter.email,
          subject: '✅ Action Required: Pickup Your Rental Machine',
          message: message
        });
        console.log("✅ Approval Email sent to " + renter.email);

      } catch (emailError) { console.error("❌ Email Failed:", emailError.message); }
    } 
    
    // CASE B: BOOKING REJECTED (Red Email)
    else if (status === 'Cancelled') {
      try {
        const reasonText = rejectionReason || 'No specific reason provided.';
        const message = `
          <!DOCTYPE html>
          <html>
          <body style="font-family: sans-serif; background-color: #fef2f2; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 10px; border: 1px solid #fecaca;">
              <h2 style="color: #b91c1c; text-align: center;">❌ Booking Declined</h2>
              <p>Hello <strong>${renter.name}</strong>,</p>
              <p>The owner has declined your request for <strong>${booking.rental.name}</strong>.</p>
              
              <div style="background-color: #fff5f5; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
                <strong>Reason:</strong> ${reasonText}
              </div>
              
              <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/rental" style="color: #2563eb;">Browse other machines</a>
              </p>
            </div>
          </body>
          </html>
        `;

        await sendEmail({
          email: renter.email,
          subject: '⚠️ Booking Request Update',
          message: message
        });
        console.log("✅ Rejection Email sent to " + renter.email);

      } catch (emailError) { console.error("❌ Email Failed:", emailError.message); }
    }

    res.status(200).json({ message: `Booking ${status}`, booking });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating status', error });
  }
};

// 8. Delete Rental (Existing)
exports.deleteRental = async (req, res) => {
  try {
    const Rental = require('../models/Rental');
    const { id } = req.params;

    const rental = await Rental.findById(id);
    if (!rental) return res.status(404).json({ message: "Machine not found" });

    if (rental.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Rental.findByIdAndDelete(id);
    res.status(200).json({ message: "Machine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 9. Toggle Availability (Existing)
exports.toggleRentalAvailability = async (req, res) => {
  try {
    const Rental = require('../models/Rental');
    const { id } = req.params;
    const { reason } = req.body;

    const rental = await Rental.findById(id);
    if (!rental) return res.status(404).json({ message: "Machine not found" });

    if (rental.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (rental.available) {
      rental.available = false;
      rental.unavailabilityReason = reason || "Not specified";
    } else {
      rental.available = true;
      rental.unavailabilityReason = "";
    }

    await rental.save();
    res.status(200).json(rental);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};